// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "../src/BinderDrop.sol";

contract BinderDropDeployScript is Script {
    function run() external {
        // NOTE:  THIS PRIVATE KEY WILL BE THE FIRST ADMIN OF THE CONTRACT
        // THIS ADMIN CAN ADD MORE ADMINS
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        // NOTE: ADD DEFAULT BASE URI
        new BinderDrop();
        vm.stopBroadcast();
    }
}
