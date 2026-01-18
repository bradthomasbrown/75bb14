import { _e4e1df_ } from "@bradthomasbrown/75bb14/e4e1df";
import { _dd2554_ } from "@bradthomasbrown/75bb14/dd2554";
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
const _d5_ = new _dd2554_(null, node, alice);
await node.client.request("anvil_setBalance", [alice.address, `0x${((1n << 256n) - 1n).toString(16)}`]);
const [aliceStartBalance, bobStartBalance] = await Promise.all([alice, bob].map(entity => node.getBalance(entity.address, "latest")));
// "promise" here is just the promise that the node has received and accepted our request, not necessarily a sign that the tranasction is in the blockhain at all
const [txhash, promise] = await _d5_.send(8_000_000n, bob.address, 1000000000000n, null);
await Promise.all([promise, _d5_.wait(txhash)]);
const [aliceEndBalance, bobEndBalance] = await Promise.all([alice, bob].map(entity => node.getBalance(entity.address, "latest")));
console.log(await node.getTransactionByHash(txhash));
console.log({ aliceStartBalance, bobStartBalance, aliceEndBalance, bobEndBalance });
/* {
  aliceStartBalance: 4503599627370496n,
  bobStartBalance: 0n,
  aliceEndBalance: 4460599627370496n,
  bobEndBalance: 1000000000000n,
} */