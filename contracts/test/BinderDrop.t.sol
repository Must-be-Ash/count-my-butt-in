// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../src/BinderDrop.sol";

contract BinderDropFactoryTest is Test, BinderDrop {
  using stdStorage for StdStorage;
  BinderDrop private binderDrop;
  function setUp() public {
    binderDrop = new BinderDrop();
  }
  function test_transfer() public {
    binderDrop.mintTo(address(1), 1);
    assertEq(binderDrop.ownerOf(1), address(1));
    vm.startPrank(address(1));
    vm.expectRevert(IsSoulbound.selector);
    binderDrop.transferFrom(address(1), address(2), 1);
    vm.stopPrank();
  }
}