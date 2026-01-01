# 75bb14
This is a simple, convenience library for combining an EvmEntity and a Node in TypeScript/JavaScript. 

## Why?
An EvmEntity, to us, is just an EVM-flavored secpk256k1-and-keccak256 powered ECDSA thin wrapper.
A Node is, to us, a wrapper over some EVM node (via JSON RPC API).
It would seem natural then that to make these things more convenient to use together, that we combine the ideas, but somewhere separate (here).
An ECDSA-focused concept like EvmEntity shouldn't be working in terms of EVM chain primitives like the `from`, `to`, `input` fields of some `transaction`, so this library bridges that gap so those simpler EVM chain primitives can be used.
It also is a place for putting features like the ability to "wait" for a transaction (or to define what that means) and to define behaviors for how transacting should be done.
For example, how do we want to manage the nonce? How do we want to manage the gas price? How do we want a consumer of a `75bb14`-generated class instance to specify how much gas they want to use?
One can use the `75bb14` function to generate classes whose instances act in simple or complex ways, handling these matters.

## Installation
```sh
npm i @bradthomasbrown/75bb14
```

## Usage
```js
import { _e4e1df_ } from "@bradthomasbrown/75bb14/e4e1df";
import { _900ef2_ } from "@bradthomasbrown/900ef2";
import { EvmEntity } from "@bradthomasbrown/entity/evm";

const port = 8545;
// 900ef2 is a sort of "containerized EVM node manager". can work with anvil, geth, etc.
const Anvil = _900ef2_("ghcr.io/foundry-rs/foundry:v1.5.1", `anvil -b 1 -p ${port} --host 0.0.0.0`);
const node = await Anvil.make(port);
const alice = EvmEntity.random();
const bob = EvmEntity.random();
// e4e1df is a sort of "combining layer of an EvmEntity (itself just a light layer of secp256k1 and keccak256 over ECDSA
// it knows nothing about transactions, just raw data) and a node (JSON RPC convenience)
const _d5_ = new _e4e1df_(alice, node, null);
await node.client.request("anvil_setBalance", [alice.address, "0x10000000000000"]);
const [aliceStartBalance, bobStartBalance] = await Promise.all([alice, bob].map(entity => node.getBalance(entity.address, "latest")));
// "promise" here is just the promise that the node has received and accepted our request, not necessarily a sign that the tranasction is in the blockhain at all
const [txhash, promise] = await _d5_.send(bob.address, null, 1000000000000n);
await Promise.all([promise, _d5_.wait(txhash)]);
const [aliceEndBalance, bobEndBalance] = await Promise.all([alice, bob].map(entity => node.getBalance(entity.address, "latest")));
console.log({ aliceStartBalance, bobStartBalance, aliceEndBalance, bobEndBalance });
/* {
  aliceStartBalance: 4503599627370496n,
  bobStartBalance: 0n,
  aliceEndBalance: 4460599627370496n,
  bobEndBalance: 1000000000000n,
} */
```