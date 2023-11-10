// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../src/BinderDropFactory.sol";

contract BinderDropFactoryTest is Test, BinderDropFactory {
  using stdStorage for StdStorage;
  BinderDropFactory private binderDropFactory;
  function setUp() public {
    binderDropFactory = new BinderDropFactory();
  }
  function test_testCreateBinderDrop() public {
    address clone = binderDropFactory.createBinderDrop(address(1));
    emit log_address(clone);
  }
}