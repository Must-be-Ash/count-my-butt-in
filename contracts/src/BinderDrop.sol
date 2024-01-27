// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import "./Admins.sol";

error NonExistentToken();
error IsSoulbound();
error OnlyOneMintAllowed();
error PublicMintsPaused();
error PublicMintsActive();
error MintPriceNotPaid();
error HashVerificationFailed();

contract BinderDrop is ERC721, Admins, Initializable {
    using Strings for uint256;

    bool public publicMintsPaused;
    uint public mintCost = 0;
    uint256 internal _tokenCount = 0;
    // the tokenId that is the boundary between revealed and pre-revealed tokens
    uint256 internal _revealedTokenIdBoundary;
    uint256 internal _maxTokenCount = 0;
    string public defaultURI;
    string public revealedURI;
    mapping(uint256 => bool) revealedTokens;

    constructor() ERC721("BinderDrop", "BinderDropV1") {}

    function initialize(address _creator, string memory defaultUri, address _server, uint cost, uint256 _batchSize) external initializer {
      require(_creator != address(0));
      creator = _creator;
      defaultURI = defaultUri;
      server = _server;
      mintCost = cost;
      _maxTokenCount =  _batchSize;
    }

    event AutographIncoming(address minter, string orderId, address recipient, uint256 tokenId, bytes32 hash);

    function pausePublicMints() external onlyAdmin {
      require(!publicMintsPaused, "Public mints are already paused.");
      publicMintsPaused = true;
    }

    function unpausePublicMints() external onlyAdmin {
      require(publicMintsPaused, "Public mints are already unpaused.");
      publicMintsPaused = false;
    }

    // soulbound
    function transferFrom(address from, address to, uint256 tokenId) public override {
      // tokens are only mintable, not transferrable
      require(from == address(0) || to == address(0), "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");
    
      super.transferFrom(from, to, tokenId);
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only the owner of the token can burn it.");
        _burn(tokenId);
    }

    function _verifyHash(bytes32 hash, bytes memory signature) internal view returns (bool) {
        return isAdmin(ECDSA.recover(hash, signature));
    }
    function verifyMintCall(address recipient, uint256 tokenId, bytes memory signature) public view returns (bool) {
        bytes32 payloadhash = keccak256(abi.encode(recipient, tokenId));
        bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", payloadhash));
        return _verifyHash(hash, signature);
    }
    /**
     * @dev mintTo to create a new token defaults to pre-revealed art
     *
     * @param recipient which address the tokenId goes to
     * @param signature string passed on from the server
     */
    function mintTo(string memory orderId, address recipient, bytes memory signature) public payable {
      // recipient-tokenid pair will always be unique
      // hash is the keccack256 over recipient,tokenId
      // tokenId is kept track of on the server
      // if a tokenid is already minted, the function will revert (erc721 standard)
      // check if hash is signed by an admin
      // recipient will always be a tokenbound account address associated with
      // a selected NFT
      // tokenid is a unique integer selected by the server
      // if minting & public mints paused
      if (publicMintsPaused) {
        revert PublicMintsPaused();
      }
      if (balanceOf(recipient) > 0) {
        revert OnlyOneMintAllowed();
      }
      // Check price
      require(msg.value >= mintCost, "Must pay more.");
      if (_maxTokenCount != 0 && _tokenCount == _maxTokenCount) {
        // the last token mint was _maxTokenCount
        // should revert here
        // unless maxTokenCount is increased
        revert MaxTokenCountReached();
      }
      bytes32 payloadhash = keccak256(abi.encode(recipient));
      bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", payloadhash));
      if (!_verifyHash(hash, signature)) {
        revert HashVerificationFailed();
      }
      ++_tokenCount;
      _safeMint(recipient, _tokenCount);
      emit AutographIncoming(msg.sender, orderId, recipient, _tokenCount, hash);
    }

    function bumpTokenCount(unint256 amount) public onlyAdmin returns (uint256) {
      _maxTokenCount += amount;
      return _maxTokenCount;
    }

    /**
     *
     * @param revealedTokenIdBoundary the tokenId that is the boundary between revealed and pre-revealed tokens. This determined which tokenUrl to return
     */
    function revealTokens(uint256 revealedTokenIdBoundary, string memory _revealedURI) public onlyAdmin {
      _revealedTokenIdBoundary = revealedTokenIdBoundary;
      revealedURI = _revealedURI;
    }

    function withdraw(address receiver, uint256 amount) external onlyAdmin {
        (bool sent, ) = receiver.call{value: amount}("");
        require(sent, "Failed to transfer to receiver");
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
      require(ownerOf(tokenId) != address(0), 'Non existent token');

      if (tokenId > _revealedTokenIdBoundary) {
        // default uri returned
        return bytes(defaultURI).length > 0 ? string(abi.encodePacked(defaultURI)) : "";
      }
      // returned revealed uri
      return string(abi.encodePacked(revealedURI, "/", uint256(tokenId).toString()));
    }
}
