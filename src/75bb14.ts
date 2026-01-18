import { encode } from "@bradthomasbrown/rlp";
import { keccak256 } from "@bradthomasbrown/keccak/keccak256";
import { EvmEntity } from "@bradthomasbrown/entity/evm";
import { Node } from "@bradthomasbrown/ejra";
import sendLegacyTransaction from "./lib/sendLegacyTransaction.js";

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
function _75bb14_<
    _54_,
    _b0_ extends Array<any>,
    _10_ extends Array<any>,
    _51_,
    _24_
>(
    _8c_:(state:_54_, node:InstanceType<typeof Node>, entity:InstanceType<typeof EvmEntity>, ...args:_b0_)=>_51_,
    _ff_:(state:_54_, node:InstanceType<typeof Node>, entity:InstanceType<typeof EvmEntity>, ...args:_10_)=>_24_
) {
    return class _57461f_ {

        node:InstanceType<typeof Node>;
        entity:InstanceType<typeof EvmEntity>;
        state:_54_;
        send:(...args:_b0_)=>_51_;
        wait:(...args:_10_)=>_24_;

        constructor(state:_54_, node:InstanceType<typeof Node>, entity:InstanceType<typeof EvmEntity>) {
            this.entity = entity;
            this.node = node;
            this.state = state;
            this.send = function send(...args:_b0_) { return _8c_(state, node, entity, ...args); };
            this.wait = function wait(...args:_10_) { return _ff_(state, node, entity, ...args); };
        }

    }
}

export { _75bb14_ };