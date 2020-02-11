/**
 * PHB Vessel Module that will help with the handling of vessel relays
 */
const debug = require('debug')('PHB_Relay');
const events = require('events');
const EventEmitter =  events.EventEmitter;

class PHB_Relay extends EventEmitter {
	constructor(opts) {
		super();

		/**
		 * Our relay can be either mechanical (default) or ssr
		 * @type {*|string}
		 * @private
		 * @default mechanical
		 */
		this._relayType = opts.relayType || "mechanical";

		/**
		 * State of our relay, default to false (off)
		 * @type {*|boolean}
		 * @private
		 * @default false
		 */
		this._relayState = opts.relayState || false;

		/**
		 * This is in minutes, zero means no duty cycle
		 * @type {*|number}
		 * @private
		 */
		this._relayDutyCycle = opts._relayDutyCycle || 0;

		// We require a pin or this is useless so check it
		if (opts.relayPin === "" || isNaN(Number(opts.relayPin))) {
			this.emit("error", new Error("The required relay pin number was not provided!"));
			return;
		}
		/**
		 * The relay pin on the associated GPIO for operation
		 * @type {number}
		 * @private
		 */
		this._relayPin = Number(opts.relayPin);
	}

	/**
	 * The relay pin on the associated GPIO for operation
	 * @returns {number}
	 */
	get relayPin() {
		return this._relayPin;
	}

	/**
	 * The relay pin on the associated GPIO for operation
	 * @type Number
	 * @param val
	 */
	set relayPin(val) {
		this._relayPin = Number(val);
	}

	/**
	 * Our relay can be either mechanical (default) or ssr
	 * @returns {*|string}
	 */
	get relayType() {
		return this._relayType;
	}

	/**
	 * Our relay can be either mechanical or ssr
	 * @param val string
	 */
	set relayType(val) {
		this._relayType = val;
	}

	/**
	 * State of our relay, true (on) | false (off)
	 * @returns boolean
	 */
	get relayState() {
		return this._relayState;
	}

	/**
	 * The duty cycle of our relay (or attached device), this is in minutes, zero means no duty cycle
	 * @returns number
	 */
	get relayDutyCycle() {
		return this._relayDutyCycle;
	}

	/**
	 * The duty cycle of our relay (or attached device), this is in minutes, zero means no duty cycle
	 * @param val number
	 */
	set relayDutyCycle(val) {
		this._relayDutyCycle = Number(val).toFixed(0);
	}
}

module.exports = PHB_Relay;