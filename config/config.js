module.exports = {
	development: {
		dialect: "sqlite",
		storage: "./db.development.sqlite"
	},
	production: {
		dialect: "sqlite",
		storage: "./db.prod.sqlite"
	}
};