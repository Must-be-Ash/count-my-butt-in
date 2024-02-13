// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;
import "./Admins.sol";
import "openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract RecoverTokens is Admins {
    function withdrawERC20(address _tokenContract, uint256 _amount, address _to) external onlyAdmin {
        IERC20(_tokenContract).transfer(_to, _amount);
    }

    function withdrawERC721(
        address tokenAddress,
        address tokenReceiver,
        uint256 tokenId,
        bytes memory data
    ) external onlyAdmin {
        IERC721(tokenAddress).safeTransferFrom(address(this), tokenReceiver, tokenId, data);
    }

    function withdrawETH(address receiver, uint256 amount) external onlyAdmin {
      (bool sent, ) = receiver.call{value: amount}("");
      require(sent, "Failed to transfer to receiver");
    }
}