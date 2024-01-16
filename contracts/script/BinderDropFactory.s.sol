// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "../src/BinderDropFactory.sol";

contract BinderDropFactoryDeployScript is Script {
    address server = 0xCD56df7B4705A99eBEBE2216e350638a1582bEC4;
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        new BinderDropFactory(server);
        vm.stopBroadcast();
    }
}
