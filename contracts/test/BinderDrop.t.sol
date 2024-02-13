// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../src/BinderDrop.sol";

contract BinderDropTest is Test {
    using stdStorage for StdStorage;

    BinderDrop binderDrop;
    address deployer;

    function setUp() public {
      deployer = address(this);
      binderDrop = new BinderDrop('https://binderdrop.com/api/token/');
    }

    function test_adminSetUp() public {
      assertEq(binderDrop.isAdmin(deployer), true);
      // test random address
      assertEq(binderDrop.isAdmin(address(3)), false);
    }

    function test_addAdmin() public {
      address alice = address(3);
      // only an admin can add new admins
      vm.startPrank(alice);
      assertEq(binderDrop.isAdmin(alice), false);
      vm.expectRevert();
      binderDrop.addNewAdmin(alice);
      vm.stopPrank();

      vm.startPrank(deployer);
      assertEq(binderDrop.isAdmin(alice), false);
      binderDrop.addNewAdmin(alice);
      assertEq(binderDrop.isAdmin(alice), true);
      vm.stopPrank();
    }

}
