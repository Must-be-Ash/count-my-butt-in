// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";


error NonExistentToken();

contract BinderDrop is ERC721 {
    string public defaultURI = "https://SAMPLE-URI/";
    string public revealedURI;
    mapping(uint256 => bool) revealedTokens;

    mapping(uint256 => string) public revealedIds;
    constructor() ERC721("BinderDrop", "BinderDropV1") { }
    function mintTo(address recipient, uint256 tokenId) public returns (uint256) {
      _safeMint(recipient, tokenId);
    }
    function updateRevealURI(string memory _revealedURI) external {
      revealedURI = _revealedURI;
    }
    function revealBulk(uint256[] memory tokens) public {
      if (ownerOf(tokenId) == address(0)) {
        revert NonExistentToken();
      }
      for (uint i = 0; i < tokens.length; ++i) {
        revealedTokens[tokens[i]] = true;
      }
    }
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
      if (ownerOf(tokenId) == address(0)) {
        revert NonExistentToken();
      }
      if (revealedIds[tokenId] == "") {
        // default uri returned
        return bytes(defaultURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
      }
      // returned revealed uri
      return string(abi.encodePacked(revealedIds[tokenId]));
    }
}
