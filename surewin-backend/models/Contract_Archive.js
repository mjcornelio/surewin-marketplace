const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = require("../db/connect");

const Contract_Archive = sequelize.define("contract_archive", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street_address: {
    type: DataTypes.STRING,
  },
  province: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  barangay: {
    type: DataTypes.STRING,
  },
  zip: {
    type: DataTypes.STRING,
  },
  stall: {
    type: DataTypes.STRING,
  },
  start_date: {
    type: DataTypes.DATE,
  },
  end_date: {
    type: DataTypes.DATE,
  },
  deposit: {
    type: DataTypes.INTEGER,
  },
  balance: {
    type: DataTypes.INTEGER,
  },
  rental_amount: {
    type: DataTypes.INTEGER,
  },
  rental_frequency: {
    type: DataTypes.ENUM,
    values: ["Monthly", "Daily"],
  },
  status: {
    type: DataTypes.ENUM,
    values: ["Active", "Ended"],
  },
  electric_meter: {
    type: DataTypes.STRING,
  },
  water_meter: {
    type: DataTypes.STRING,
  },
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ");
  });

module.exports = Contract_Archive;
