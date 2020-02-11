"use strict";

const supportsColor = require('supports-color');
const debug = require('debug')('PaperhouseBrewing:Operations');
//const util = require('util');
const events = require('events');
const path = require('path');
const EventEmitter =  events.EventEmitter;
const { Board, Thermometer } = require("johnny-five");
const PHB_Vessel = require("./phb_vessel");
const {PHBConfig} = require('./phb_sequelize');

//const PHB_Database = require("./phb_database");
//const Node_PID = require("node-pid");

const board = new Board({
	repl: false,
});

/**
 * PHB Operations Module that will do most of the heavy lifting
 */
class PHB_Operations extends EventEmitter {

	/**
	 *
	 * @param options Object of properties to customize the data output
	 */
	constructor(options) {
		super();		// Parent constructor call

		this._activeConfigs = [];
		this._freeSensors = [];
		this._assignedSensors = [];

		this.sensorMonitorState = false;

		this.defaults = {
			operationMode 		: "brewery",
			temperatureScale 	: "f",
			roundTemperatures	: true,
			roundTempTo			: 2,
			firmataOneWirePin	: 2,
			enableParasiticPower: false
		};

		// We accept the users options over our defaults
		this.opts = {...this.defaults, ...options};

		// Handle a few things as required
		board.on("error", (err) => {
			this.bubbleMsg("systemError", err);
			debug("Board Error (emit): " + err);
		});

		// If we do not have any config entries we need to alert the frontend for setup
		PHBConfig.findAll({
			where: {
				// We only want the active configs
				configActive: true
			}
		})
			.then((configs) => {
				if (configs.length <= 0) {
					this.bubbleMsg("newSystem", true);
				} else {
					// If we made it here we have some configurations we need to process, so grab them
					debug("Start system with " + count + " configs.");
					this._activeConfigs = configs;
					this.startSystemMonitors();
				}
			});
	}

	get activeConfigs() {
		return this._activeConfigs;
	}

	set activeConfigs(val) {
		this._activeConfigs = val;
	}

	get freeSensors() {
		return this._freeSensors;
	}

	set freeSensors(val) {
		this._freeSensors = val;
	}

	get assignedSensors() {
		return this._assignedSensors;
	}

	set assignedSensors(val) {
		this._assignedSensors = val;
	}

	convertC2F(tempC) {
		return (tempC * 9/5) + 32;
	}

	getAddress(device) {
		// 64-bit device code
		// device[0]    => Family Code
		// device[1..6] => Serial Number (device[1] is LSB)
		// device[7]    => CRC
		let i, result = 0;
		for (i = 6; i > 0; i--) {
			result = result * 256 + device[i];
		}
		return result;
	}

	/**
	 * This will search our activeSensors property for a single address and return true/false
	 * @param address
	 */
	findByAddress(address) {
		this.activeSensors.forEach(function(sensor) {
			if (sensor.sensorAddress === address) {
				return true;
			}
		});

		return false;
	}

	round(value, decimals) {
		value = parseFloat(value);
		return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
	}

	/**
	bubbleTemp(vessel, temp) {
		// First we need to find out if we have this sensor assigned to someone
		this.emit(vessel, this.opts.temperatureScale === "f" ? this.convertC2F(temp) : temp);
	}
	 **/

	bubbleMsg(event, msg) {
		let _t = {};
		_t[event] = msg;
		debug(_t);
		this.emit(event, msg);
	}

	/**
	 * This will push all the sensors discovered into our managed array/object
	 * @param sensorObject is organized as {address, celsius, fahrenheit, kelvin}
	 */
	pushSensor(sensorObject) {
		/**
		 * Our allSensors is organized as ..[address.toString] = {address:address,celsius:celsius,kelvin:kelvin}
		 * This will make overwriting and lookups easier
		 */

		/*
		this._allSensors[sensorObject.a.toString(16)] = {
			address: sensorObject.a,
			c: sensorObject.c,
			f: sensorObject.f,
			k: sensorObject.k
		};
		*/

		// Now we need to figure out what all sensors we have monitored and which ones are assigned/free
		this.activeSensors.forEach(function(sensor) {
			//if (this.sensor.sensorAddress === )
		});

		// Debugging
		//console.log(util.inspect(this._allSensors, false, null, true));
	}

	/**
	 * We need to setup the sensors for each vessel (fermenter or brewing)
	 *
	 * Once setup these will automatically emit change events when
	 * the temperature of the particular sensor changes, this is also our
	 * trigger for just about all functions of the system as the entire process
	 * is based on temperature control and changes
	 */
	startSystemMonitors() {

		/**
		let fermenterSensors = [
			//{ label: "fermenter1", sensorAddress: 175350980, sensorType: "DS18B20" },
			{ label: "fermenter2", sensorAddress: 0x9373dd4, sensorType: "DS18B20" },
			//{ label: "discovery", sensorAddress: 0x00, sensorType: "DS18B20" },
		];
		**/

		let me = this;

		// Wait for the board to be ready
		board.on("ready", () => {
			this._activeConfigs.forEach(function(vessel, key) {
				// Each activeSensor object needs to be a phb_vessel object
				if (!(vessel instanceof PHB_Vessel)) {
					// Save the data we have
					let _tData = vessel;
					// Clear the object
					me.activeSensors[key] = {};
					// Start a new vessel object AND Re-assign the data we were passed
					vessel = me.activeSensors[key] = new PHB_Vessel(_tData);
				}

				// Isolate the Thermometer Object
				let thermObject = vessel.thermObj;

				// Check if we have an object and/or it's already enabled
				if ((thermObject instanceof Thermometer) && thermObject.state) {
					debug("startSensorMonitors : Thermometer object already exists and is started.");
				} else if ((thermObject instanceof Thermometer) && !thermObject.state) {
					debug("startSensorMonitors : Thermometer object already exists but needs to be started.");
					thermObject.enable();
				} else {
					// If we made it here we need to start a new instance
					thermObject = new Thermometer({
						address: vessel.sensorAddress,
						controller: vessel.sensorType,
						pin: me.opts.firmataOneWirePin,
						enableParasiticPower: me.opts.enableParasiticPower
					});

					thermObject
						.on("change", () => {
							// Extract our properties and data
							const{address, celsius, fahrenheit, kelvin} = thermObject;

							// Set them to make them a bit cleaner to access
							vessel.sensorAddress = address;
							vessel.tempC = celsius;
							vessel.tempF = fahrenheit;
							vessel.tempK = kelvin;

							//debug(`Thermometer at address: 0x${address.toString(16)}`);
							debug("startSensorMonitors : Thermometer at address: " + address);
							//debug("  celsius      : ", celsius);
							debug("  fahrenheit   : ", fahrenheit);
							//debug("  kelvin       : ", kelvin);
							//debug("--------------------------------------");
							//this.pushSensor({a:address,c:celsius,f:fahrenheit,k:kelvin});

							// Trigger the responses based on the temperature change
							me.triggerTempControl(vessel);
						})
						.on("error", (err) => {
							debug("startSensorMonitors : " + err);
							me.bubbleMsg("systemError", err);
						});
				}
			});
		});
	}

	triggerTempControl(vessel) {
		// We need to do a couple of things,
	}

	/**
	 * We stop any sensors that are initialized and running, this keeps collisions on the one wire from
	 * happening if we are running other operations
	 */
	stopAllSensorMonitors() {
		let me = this;

		// Attempt to disable all thermometers
		this.activeSensors.forEach(function(vessel) {
			me.stopSensorMonitor(vessel);
		});
	}

	/**
	 * We stop a partiuclar sensor that is initialized and running
	 */
	stopSensorMonitor(vessel) {
		if (vessel.thermObj instanceof Thermometer) {
			vessel.thermObj.disable();
		}
	}

	/**
	 * Try and find any sensors we have attached to the one wire bus, then compare those
	 * against the known sensors we have to see if any are 'free'
	 *
	 * @return array Return an array of devices that are available for assignment.
	 */
	trySensorDiscovery() {
		let me = this;

		try {
			// First we need to stop the existing sensors if we have any
			this.stopAllSensorMonitors();

			// Now run our manual routine to discover all devices on the one wire link
			board.io.sendOneWireConfig(me.opts.firmataOneWirePin, me.opts.enableParasiticPower);
			board.io.sendOneWireSearch(me.opts.firmataOneWirePin, function(err, devices) {
				if (err) {
					this.emit("systemError", err);
					return;
				}

				let allDevices = devices.filter(function (device) {
					return device[0] === 0x28;	// Filter the found sensors to only the DS18B20 0x28 family
				}, this);

				allDevices = allDevices.map(me.getAddress);
				let availableDevices = [];

				// Filter the found sensors to only addresses we don't have active
				allDevices.forEach(function(device) {
					if (!me.findByAddress(device)) {
						availableDevices.push(device);
					}
				});

				// Now restart the sensor monitors for known sensors
				me.startSystemMonitors();

				if (availableDevices.length > 0) {
					debug('trySensorDiscovery : ---- START Device Discovery Results ----');
					availableDevices.forEach((s) => {
						debug('    Found Address : ' + s);
					});
					me._freeSensors = availableDevices; // Store for later reference if we need it
					return me._freeSensors;
				} else {
					debug("No sensors found.");
					return me._freeSensors = {}; // clear the free sensors
				}
			});
		} catch (err) {
			debug('trySensorDiscovery catch block : ' + err);
		}
	}
}

module.exports = PHB_Operations;