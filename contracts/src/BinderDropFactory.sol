// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "openzeppelin-contracts/contracts/proxy/Clones.sol";
import "./BinderDrop.sol";

contract BinderDropFactory {
  address immutable public binderDrop;

  event BinderDropCreated (address clone, address creator);

  constructor() {
    binderDrop = address(new BinderDrop());
  }

  function createBinderDrop(address creator) external returns (address) {
    require(creator != address(0));
    address clone = Clones.clone(binderDrop);
    emit BinderDropCreated(clone, creator);
    return clone;
  }
}
