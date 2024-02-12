// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error NonExistentToken();
error IsSoulbound();
error OnlyOneMintAllowed();
error PublicMintsPaused();
error PublicMintsActive();
error MintPriceNotPaid();
error HashVerificationFailed();
error MaxTokenCountReached();

contract BinderDrop is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    bool public publicMintsPaused;
    uint256 public mintCost = 0;
    uint256 internal _tokenCount = 0;
    string public defaultURI;
    mapping(uint256 => bool) revealedTokens;

    event AutographIncoming(address minter, string orderId, address recipient, uint256 tokenId, bytes32 hash);

    constructor(address initialOwner, string memory _defaultURI)
        ERC721("BinderDrop", "BinderDropV1")
        Ownable(initialOwner)
    {
      defaultURI = _defaultURI;
    }

    function _baseURI() internal pure override returns (string memory) {
        return defaultURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function pausePublicMints() external onlyOwner {
      require(!publicMintsPaused, "Public mints are already paused.");
      publicMintsPaused = true;
    }

    function unpausePublicMints() external onlyOwner {
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
        return owner() == ECDSA.recover(hash, signature);
    }
   
    function mintTo(string memory orderId, address recipient, bytes memory signature, string memory uri, bytes32 nonce) public payable {
      if (publicMintsPaused) {
        revert PublicMintsPaused();
      }

      bytes32 payloadhash = keccak256(abi.encode(recipient, nonce));
      bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", payloadhash));
      if (!_verifyHash(hash, signature)) {
        revert HashVerificationFailed();
      }
      ++_tokenCount;
      _safeMint(recipient, _tokenCount);
      _setTokenURI(_tokenCount, uri);
      emit AutographIncoming(msg.sender, orderId, recipient, _tokenCount, hash);
    }

    function withdraw(address receiver, uint256 amount) external onlyOwner {
        (bool sent, ) = receiver.call{value: amount}("");
        require(sent, "Failed to transfer to receiver");
    }

    function tokenURI(uint256 tokenId)
      public
      view
      override(ERC721, ERC721URIStorage)
      returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
