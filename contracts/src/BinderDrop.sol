// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import "./Admins.sol";

error NonExistentToken();
error IsSoulbound();
error OnlyOneMintAllowed();
error PublicMintsPaused();
error PublicMintsActive();
error MintPriceNotPaid();
error HashVerificationFailed();

contract BinderDrop is ERC721, Admins {
    bool public publicMintsPaused;
    string public defaultURI = "https://SAMPLE-URI/";
    string public revealedURI;
    mapping(uint256 => bool) revealedTokens;
    uint256 public MINT_PRICE = 0.01 ether;

    event AutographIncoming(address indexed minter, address indexed recipient, uint256 indexed tokenId, bytes32 hash);

  constructor() ERC721("BinderDrop", "BinderDropV1") {
   }

    function pausePublicMints() external onlyAdmin {
      if (publicMintsPaused) {
          revert PublicMintsPaused();
      }
      publicMintsPaused = true;
    }
    function unpausePublicMints() external onlyAdmin {
      if (!publicMintsPaused) {
          revert PublicMintsActive();
      }
      publicMintsPaused = false;
    }

    // soulbound
    function transferFrom(address from, address to, uint256 tokenId) public override {
      // tokens are only mintable, not transferrable
      if (from != address(0)) {
        revert IsSoulbound();
      }
      // if minting & public mints paused
      if (publicMintsPaused) {
        revert PublicMintsPaused();
      }
      super.transferFrom(from, to, tokenId);
    }

    function _verifyHash(bytes32 hash, bytes memory signature) internal view returns (bool) {
        return isAdmin(ECDSA.recover(hash, signature));
    }
    /**
     * @dev mintTo to create a new token defaults to pre-revealed art
     *
     * @param recipient which address the tokenId goes to
     * @param tokenId what token id is minted
     * @param signature string passed on from the server
     */
    function mintTo(address recipient, uint256 tokenId, bytes memory signature) public payable {
      // recipient-tokenid pair will always be unique
      // hash is the keccack256 over recipient,tokenId
      // tokenId is kept track of on the server
      // if a tokenid is already minted, the function will revert (erc721 standard)
      // check if hash is signed by an admin
      // recipient will always be a tokenbound account address associated with
      // a selected NFT
      // tokenid is a unique integer selected by the server
      if (balanceOf(recipient) > 0) {
        revert OnlyOneMintAllowed();
      }
      bytes32 payloadhash = keccak256((abi.encode(recipient, tokenId)));
      bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", payloadhash));
      if (!_verifyHash(hash, signature)) {
        revert HashVerificationFailed();
      }
      if (msg.value != MINT_PRICE) {
        revert MintPriceNotPaid();
      }
      _safeMint(recipient, tokenId);
      emit AutographIncoming(msg.sender, recipient, tokenId, hash);
    }

    function revealBulk(uint256[] memory tokens, string memory _revealedURI) public onlyAdmin {
      for (uint i = 0; i < tokens.length; ++i) {
        revealedTokens[tokens[i]] = true;
      }
      revealedURI = _revealedURI;
    }

    function withdraw() external onlyAdmin {
        payable(msg.sender).transfer(address(this).balance);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
      if (ownerOf(tokenId) == address(0)) {
        revert NonExistentToken();
      }
      if (!revealedTokens[tokenId]) {
        // default uri returned
        return bytes(defaultURI).length > 0 ? string(abi.encodePacked(defaultURI, tokenId)) : "";
      }
      // returned revealed uri
      return string(abi.encodePacked(revealedURI, tokenId));
    }
}
