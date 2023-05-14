const { Sequelize } = require("sequelize");

const connectDB = new Sequelize("sql12579286", "sql12579286", "PxFSa9QPfS", {
  host: "sql12.freesqldatabase.com",
  dialect: "mysql",
  port: 3306,
});

module.exports = connectDB;
