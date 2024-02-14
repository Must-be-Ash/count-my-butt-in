## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
forge script script/BinderDropFactory.s.sol:BinderDropFactoryDeployScript --rpc-url https://eth-sepolia.g.alchemy.com/v2/<ALCHEMY_KEY> --broadcast --verify -vvvv
```

### Verify

forge verify-contract --compiler-version 0.8.20 --optimizer-runs 1000 0x9693ad9Fe3fb08bab0a7491303a296dA706837AD src/BinderDrop.sol:BinderDrop --etherscan-api-key EMQMW4QAHT6JRAI1K4SXEMMVZRP4TYTAPF --verifier-url=https://api.basescan.org/api\? --watch

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
