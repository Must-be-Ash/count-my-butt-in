// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

error NonExistentToken();
error IsSoulbound();

contract BinderDrop is ERC721 {
    string public defaultURI = "https://SAMPLE-URI/";
    string public revealedURI;
    mapping(uint256 => bool) revealedTokens;
    constructor() ERC721("BinderDrop", "BinderDropV1") { }

    // soulbound
    function transferFrom(address from, address to, uint256 tokenId) public override {
        // tokens are only minted, not transferrable
        if (from != address(0)) {
          revert IsSoulbound();
        }
        super.transferFrom(from, to, tokenId);
    }

    function mintTo(address recipient, uint256 tokenId) public {
      _safeMint(recipient, tokenId);
    }
    function updateRevealURI(string memory _revealedURI) external {
      revealedURI = _revealedURI;
    }
    function revealBulk(uint256[] memory tokens) public {
      for (uint i = 0; i < tokens.length; ++i) {
        revealedTokens[tokens[i]] = true;
      }
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
