const Sequelize = require("sequelize");
require("dotenv").config();
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;

const connection = new Sequelize("guiapress", "root", MYSQL_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
  timezone: "-03:00"
})

module.exports = connection;