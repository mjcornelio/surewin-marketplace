const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = require("../db/connect");

const Utitlity = sequelize.define(
  "utility",
  {
    electricity_rate: {
      type: DataTypes.INTEGER,
    },
    water_rate: {
      type: DataTypes.INTEGER,
    },
  },
  { timestamps: false }
);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ");
  });

module.exports = Utitlity;
