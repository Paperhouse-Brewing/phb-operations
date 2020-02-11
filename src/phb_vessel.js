/**
 * PHB Vessel Module that will help with the handling of vessel data
 */
const debug = require('debug')('PaperhouseBrewing:Vessel');
const events = require('events');
const EventEmitter =  events.EventEmitter;

class PHB_Vessel extends EventEmitter {
	constructor(opts) {
		super();

		// All of our temperatures in different types
		this._tempF = 0;		// Has getter alias of F
		this._tempC = 0;		// Has getter alias of C
		this._tempK = 0;		// Has getter alias of K
		this._thermObject = {};	// Our J5 Thermometer Object
		this._PID = {};			// Our PID Object
		this._relays = [];		// This is an array of PHB_Relays if required

		// We REQUIRE a label at minimum throw error if we don't have one
		if (opts.label === "") {
			this.emit("error", new Error("The required label was not provided!"));
			return;
		}

		this.label = opts.label;
		this.sensorAddress = opts.address || 0x00;			// We default to a zero address
		this.sensorType = opts.sensorType || "DS18B20";		// We default to a DS18B20 sensor
	}

	get tempF() {
		return this._tempF;
	}

	get F() {
		return this._tempF;
	}

	set tempF(val) {
		this._tempF = val;
	}

	get tempC() {
		return this._tempC;
	}

	get C() {
		return this._tempC;
	}

	set tempC(val) {
		this._tempC = val;
	}

	get tempK() {
		return this._tempK;
	}

	get K() {
		return this._tempK;
	}

	set tempK(val) {
		this._tempK = val;
	}

	get thermObject() {
		return this._thermObject;
	}

	set thermObject(val) {
		this._thermObject = val;
	}

	get PID() {
		return this._PID;
	}

	set PID(val) {
		this._PID = val;
	}
}

module.exports = PHB_Vessel;