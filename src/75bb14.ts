// <SCHIZO-NOTES feel-free-to-ignore>
//      for testing, we want to make sure our balance is high enough for some set of transactions
//      we need a chain id to make a transaction
//      we need a gas estimate to set a gas limit for a legacy transaction
//       we'll also need this for other transaction types
//      we'll want the gas price
//       we may need this or other information for other transaction types
//      then we'll produce a signed transaction hex which can be sent via json rpc
//      then we think we'll want some sort of a sync primitive in this sequence
//       so maybe we want a "sync request handler"
//       we're thinking GPU-style command queue stuff around here
//      then we'll want to use some of the data from the sequence so far to build the next part of the sequence
//      in GPU programming, i think we'd just have a memory block
//       previous sequence block writes to the memory block
//       later sequence block reads from the memory block
//       maybe here we just have some typed object, loosely representing a struct
//      we keep thinking that we want to write programs here
//       opcodes
//      but certain kinds of odd programs
//       where opcodes may be asynchronous, then we have synchonization primitives or "barriers"
//      so that we are effectively pipelining operations
//      "machine" then will go through a sequence of opcodes until it hits a barrier then it will try to
//          satisfy each opcode
//      one such opcode may be "gasprice"
//      one may be "sign EVM transaction (return hex)"
//      one may be "sign EVM transaction given 'input' return hex"
//      maybe we have an opcode "set gas price acquisition function"?
//      maybe we have an opcode "update (to some satsifaction policy) gas price"?
//  <SCHIZO-NOTES feel-free-to-ignore/>

import { encode } from "@bradthomasbrown/rlp";
import { keccak256 } from "@bradthomasbrown/keccak/keccak256";
import { EvmEntity } from "@bradthomasbrown/entity/evm";
import { Node } from "@bradthomasbrown/ejra";

/**
 * A function which returns a class that can wrap an EvmEntity (`@bradthomasbrown/entity/evm`) and a Node (`@bradthomasbrown/ejra`)
 * to make interacting with an EVM chain under an identity more convenient.
 * @param _a6_ - A function that returns a promise for the nonce to use for some transaction.
 * @param _66_ - A function that returns a promise for the gas price to use for some transaction.
 * @param _f6_ - A function that returns a promise for the gas limit to use for some transaction.
 * @param _a9_ - A function that converts an address into a Uint8Array.
 * @param _c5_ - A function that converts data/input/calldata into a Uint8Array.
 * @param _e4_ - A function that returns a promise for the chain ID to use for some transaction.
 * @param _91_ - A synchronization barrier function that can be used to batch and execute the above promises, if the aforementioned functions don't already do so.
 * @param _fe_ - A function that implements "waiting" for some transaction hash.
 */
function _75bb14_<_b6_ extends unknown[], R, S>(
    _a6_:(_45_:InstanceType<ReturnType<typeof _75bb14_>>)=>Promise<bigint>,
    _66_:(_84_:InstanceType<ReturnType<typeof _75bb14_>>)=>Promise<bigint>,
    _f6_:(_28_:InstanceType<ReturnType<typeof _75bb14_>>, _89__:null|string, _01_:null|string, _bc_:bigint)=>Promise<bigint>,
    _a9_:(_03_:null|string)=>Uint8Array,
    _c5_:(_47_:null|string)=>Uint8Array,
    _e4_:(_2b_:InstanceType<ReturnType<typeof _75bb14_>>)=>Promise<bigint>,
    _91_:()=>void,
    _fe_:(_d3_:InstanceType<ReturnType<typeof _75bb14_>>, _e7_:string, ..._2a_:_b6_)=>Promise<R>
) {
    return class _57461f_ {

        entity:InstanceType<typeof EvmEntity>;

        node:InstanceType<typeof Node>;

        state:S;

        constructor(entity:InstanceType<typeof EvmEntity>, node:InstanceType<typeof Node>, state:S) {
            this.entity = entity;
            this.node = node;
            this.state = state;
        }

        async _78_(
            _e2_:null|string, // to string
            _88_:null|string, // calldata/input/data/bytecode string
            value=0n
        ) {
            const _8d_ = _a6_(this); // return nonce promise
            const _ba_ = _66_(this); // return gas price promise
            const _39_ = _f6_(this, _e2_, _88_, value); // return gas limit promise
            const to = _a9_(_e2_); // derive the final "to"
            const input = _c5_(_88_); // derive the final "data"/"input"
            const _cd_ = _e4_(this); // return chain id promise
            _91_(); // synchronization barrier trigger function
            const [nonce, gasPrice, gasLimit, chainId] = await Promise.all([_8d_, _ba_, _39_, _cd_]);
            const rawTxArray = [nonce, gasPrice, gasLimit, to, value, input, chainId, 0n, 0n];
            const rawTxEncoded = encode(rawTxArray);
            const signature = this.entity.sign(rawTxEncoded);
            const _7f_ = chainId * 2n + 35n + signature.v;
            const signedTxArray = [...rawTxArray.slice(0, 6), _7f_, signature.r, signature.s];
            const signedTxEncoded = encode(signedTxArray);
            const signedTxHex = `0x${signedTxEncoded.toHex()}`
            const signedTxHash = `0x${keccak256(signedTxEncoded).toHex()}`;
            const promise = this.node.sendRawTransaction(signedTxHex);
            return [nonce, signedTxHash, promise] as [bigint, string, Promise<string>];
        }

        async send(to:null|string, input:null|string, value=0n) {
            const [_nonce, signedTxHash, promise] = await this._78_(to, input, value);
            return [signedTxHash, promise] as [string, Promise<string>];
        }

        async deploy(input:string, value=0n) {
            const [nonce, signedTxHash, promise] = await this._78_(null, input, value);
            const _09_ = encode([Uint8Array.fromHex(this.entity.address.slice(2)), nonce]);
            const _c0_ = keccak256(_09_);
            const contractAddress = `0x${_c0_.slice(12).toHex()}`;
            return [contractAddress, signedTxHash, promise] as [string, string, Promise<string>];
        }

        wait(transactionHash:string, ...args:_b6_) {
            return _fe_(this, transactionHash, ...args);
        }

    }
}

export { _75bb14_ };