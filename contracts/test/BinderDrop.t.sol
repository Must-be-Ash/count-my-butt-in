// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../src/BinderDrop.sol";

contract BinderDropTest is Test, BinderDrop {
    using stdStorage for StdStorage;

    BinderDrop binderDrop;
    address deployer;

    function setUp() public {
        deployer = address(this);
        // add params
        binderDrop = new BinderDrop(/* parameters */);
    }

    function testMintSuccess() public {
        // Implement minting test
    }

    function testMintRevertOnTransfer() public {
        // Use vm.expectRevert() to test soulbound functionality
    }

    // Other test cases...

    // function test_transfer() public {
    //     binderDrop.mintTo(address(1), 1);
    //     assertEq(binderDrop.ownerOf(1), address(1));
    //     vm.startPrank(address(1));
    //     vm.expectRevert(IsSoulbound.selector);
    //     binderDrop.transferFrom(address(1), address(2), 1);
    //     vm.stopPrank();
    // }
}
