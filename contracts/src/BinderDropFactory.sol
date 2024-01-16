// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "openzeppelin-contracts/contracts/proxy/Clones.sol";
import "./BinderDrop.sol";

contract BinderDropFactory {
  address immutable public binderDrop;
  address immutable private server;

  event BinderDropCreated (address clone, address creator);

  constructor(address _server) {
    binderDrop = address(new BinderDrop());
    server = _server;
  }

  function createBinderDrop(address creator, string memory defaultUri) external returns (address) {
    require(creator != address(0));
    address clone = Clones.clone(binderDrop);
    BinderDrop(clone).initialize(creator, defaultUri, server);
    emit BinderDropCreated(clone, creator);
    return clone;
  }
}
