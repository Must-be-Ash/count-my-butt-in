// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../src/BinderDropFactory.sol";
import "../src/BinderDrop.sol";

contract BinderDropFactoryTest is Test {
    using stdStorage for StdStorage;

    BinderDropFactory binderDropFactory;
    BinderDrop binderDropTemplate;

    //   function test_testCreateBinderDrop() public {
    //     address clone = binderDropFactory.createBinderDrop(address(1));
    //     emit log_address(clone);
    //   }

    function setUp() public {
        binderDropTemplate = new BinderDrop(/* parameters */);
        binderDropFactory = new BinderDropFactory();
        // binderDropFactory.setBinderDropTemplate(address(binderDropTemplate));
    }

    function testCreateBinderDropClone() public {
        // Test clone creation
    }

    // Other test cases...
}
