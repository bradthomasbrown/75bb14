import { _75bb14_ } from "../75bb14.js";
import sendLegacyTransaction from "../lib/sendLegacyTransaction.js";

async function send(
    _state:null,
    node:InstanceType<ReturnType<typeof _75bb14_>>["node"],
    entity:InstanceType<ReturnType<typeof _75bb14_>>["entity"],
    gasLimit:bigint,
    to:null|string,
    value:bigint,
    input:null|ArrayBuffer
) {
    const nonce = await node.getTransactionCount(entity.address, "latest");
    const gasPrice = await node.gasPrice();
    const inputBytes = input === null ? new Uint8Array() : new Uint8Array(input);
    const toBytes = to !== null ? Uint8Array.fromHex(to.slice(2)) : new Uint8Array();
    const chainId = await node.chainId();
    return sendLegacyTransaction(node, entity, nonce, gasPrice, gasLimit, toBytes, value, inputBytes, chainId);
}

async function wait(
    _state:null,
    node:InstanceType<ReturnType<typeof _75bb14_>>["node"],
    _entity:InstanceType<ReturnType<typeof _75bb14_>>["entity"],
    transactionHash:string
) {
    let receipt:Awaited<ReturnType<InstanceType<ReturnType<typeof _75bb14_>>["node"]["getTransactionReceipt"]>>;
    for (let i = 0; i < 5; i++) {
        receipt = await node.getTransactionReceipt(transactionHash);
        if (receipt !== null) return receipt;
        await new Promise(r => setTimeout(r, 250));
    }
}

const _dd2554_ = _75bb14_(send, wait);

export { _dd2554_ };