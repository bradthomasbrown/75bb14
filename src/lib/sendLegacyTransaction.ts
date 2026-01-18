import { encode } from "@bradthomasbrown/rlp";
import { keccak256 } from "@bradthomasbrown/keccak/keccak256";
import { EvmEntity } from "@bradthomasbrown/entity/evm";
import { Node } from "@bradthomasbrown/ejra";

export default function(
    node:InstanceType<typeof Node>,
    entity:InstanceType<typeof EvmEntity>,
    nonce:bigint,
    gasPrice:bigint,
    gasLimit:bigint,
    to:Uint8Array,
    value:bigint,
    input:Uint8Array,
    chainId:bigint
):[string, Promise<string>] {
    const rawTxArray = [nonce, gasPrice, gasLimit, to, value, input, chainId, 0n, 0n];
    const rawTxEncoded = encode(rawTxArray);
    const signature = entity.sign(rawTxEncoded);
    const _7f_ = chainId * 2n + 35n + signature.v;
    const signedTxArray = [...rawTxArray.slice(0, 6), _7f_, signature.r, signature.s];
    const signedTxEncoded = encode(signedTxArray);
    const signedTxHex = `0x${signedTxEncoded.toHex()}`
    const signedTxHash = `0x${keccak256(signedTxEncoded).toHex()}`;
    const promise = node.sendRawTransaction(signedTxHex);
    return [signedTxHash, promise];
}