/**
 * PHB Database Module that will help with storing and retrieving data
 */
const debug = require('debug')('PaperhouseBrewing:Database');
const events = require('events');
const EventEmitter =  events.EventEmitter;
const Promise = require('bluebird');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
//const path = require('path');

class PHB_Database extends EventEmitter {
	constructor(options) {
		super();

		this.db = undefined;

		this.defaults= {
			coreDB			: "./modules/phb_operations/dbs/phb_operations.db",	// The core DB [Need to fix this path for cross platform]
			schemaDir		: "./modules/phb_operations/sql_tables/",			// Directory that holds our SQL schema files [Need to fix this path for cross platform]
			logEnable		: true,												// Do we enable the logging?
			activityEnable 	: true,												// Do we enable activity logging
			activityInterval: 5,												// How often to log the data in seconds
			tables 			: [
				{ label: "configTable", schemaFile: "phb_config_tbl.sql" },				// Table where we store all of our system configs
				//{ label: "logTable", schemaFile: "phb_log_tbl.sql" },					// Table where we store our logs
				//{ label: "fermActTable", schemaFile: "phb_ferm_act_tbl.sql" },			// Table where we store our fermentation activity
				//{ label: "brewActTable", schemaFile: "phb_brew_act_tbl.sql" },			// Table where we store our brewery activity
			]
		};

		// We accept the users options over our defaults
		this.opts = {...this.defaults, ...options};

		// Create the DB connection
		this.openDB();

		// Initialize our tables
		this.initTables();
	}

	openDB() {
		this.db = new sqlite3.Database(this.opts.coreDB, (err) => {
			if (err) {
				debug(err);
				this.db = undefined;
				return false;
			}
			debug('Database connection opened.');
		});
	}

	closeDB() {
		this.db.close((err) => {
			debug(err);
		});
		debug("Database connection closed.");
	}

	initTables() {
		/**
		 *  We need to read in all of our files that define our SQL schemas for our tables
		 *  WARNING!!! If you do NOT have a matching sql file with the table schema for the associated
		 *  table this WILL throw an error and crash out the system. Additionally this will ONLY create
		 *  the table if the table is not present already.
		 *
		 *  This can be a very destructive routing ... YOU HAVE BEEN WARNED!!!
		 */
		let me = this;
		me.opts.tables.forEach(function(table, key) {
			fs.readFile(me.opts.schemaDir + table.schemaFile, 'utf8', (err, data) => {
				if (err) {
					//this.emit("error", err);
					debug(err);
					return false;
				}

				// Now execute the code in the file to make sure we have all required tables and default data
				me.db.exec(data, (err)=>{
					if (err) {
						debug(err);
					}
				});
			});
		});
	}
}

module.exports = PHB_Database;