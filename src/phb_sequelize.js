/**
 * This was HEAVILY based off https://www.codementor.io/@mirko0/how-to-use-sequelize-with-node-and-express-i24l67cuz
**/
const debug = require('debug')('PaperhouseBrewing:Database');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const Sequelize = require('sequelize');

/**
 * All of our models we define separately
 */
const phbConfigModel = require('../models/phb_config');

/**
 * Define our actual sequelize instance
 */
const sequelize = new Sequelize({
	dialect: config.dialect,
	storage: config.storage
});

/**
 * Now create all the model instances
 */
const PHBConfig = phbConfigModel(sequelize, Sequelize);

sequelize.sync({
	//force: true	// This is a destructive operation ONLY enable if you are trying to reset
})
	.then(() => {
		debug(`Database & tables created!`);
	});

module.exports = {
	PHBConfig
};