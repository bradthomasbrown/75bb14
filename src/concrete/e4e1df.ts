import type { Node } from "@bradthomasbrown/ejra";
import { _75bb14_ } from "../75bb14.js";

function _4403dc_(_d2_:InstanceType<ReturnType<typeof _75bb14_>>) {
    return _d2_.node.getTransactionCount(_d2_.entity.address, "latest");
}

function _0da055_(_ce_:InstanceType<ReturnType<typeof _75bb14_>>) {
    return _ce_.node.gasPrice();
}

function _422b72_(
    _d6_:InstanceType<ReturnType<typeof _75bb14_>>,
    _fa_:null|string,
    _01_:null|string
) {
    const _5b_:Parameters<typeof _d6_["node"]["estimateGas"]>[0] = {};
    _5b_.from = _d6_.entity.address;
    if (_fa_ !== null) _5b_.to = _fa_;
    if (_01_ !== null) _5b_.input = _01_;
    return _d6_.node.estimateGas(_5b_, "latest");
}

function _e752dc_(_80_:null|string) {
    if (_80_ === null) return new Uint8Array();
    if (_80_.startsWith("0x")) return Uint8Array.fromHex(_80_.slice(2));
    return Uint8Array.fromHex(_80_);
}

function _e4aeae_(_ef_:InstanceType<ReturnType<typeof _75bb14_>>) {
    return _ef_.node.chainId();
}

function _3c6f98_() {}

async function _022a28_(_ad_:InstanceType<ReturnType<typeof _75bb14_>>, _85_:string) {
    let receipt:Awaited<ReturnType<InstanceType<typeof Node>["getTransactionReceipt"]>>;
    for (let i = 0; i < 5; i++) {
        receipt = await _ad_.node.getTransactionReceipt(_85_);
        if (receipt != null) return receipt;
        await new Promise(r => setTimeout(r, 250));
    }
    throw new Error(`failed to wait for receipt from transaction hash: ${_85_}`);
}

/**
 * A simple 75bb14 which will:
 * - get the most recently available nonce from the node for each transaction
 * - get the most recently available gas price from the node for each transaction
 * - get the gas estimate from the node for each transaction
 * - get the chain id from the node for each transaction
 * without batching,
 * and will perform a simple 5-attempt 250-ms delay poll for a transaction reciept from the node as a wait condition.
 *
 * "Good enough" for local development work, maybe.
 */
const _e4e1df_ = _75bb14_(_4403dc_, _0da055_, _422b72_, _e752dc_, _e752dc_, _e4aeae_, _3c6f98_, _022a28_);

export { _e4e1df_ };