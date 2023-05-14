const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = require("../db/connect");

const ParkingCollection = sequelize.define("parking_collection", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  received_from: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  received_amount: {
    type: DataTypes.INTEGER,
  },
  payment_date: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.STRING,
  },
});

ParkingCollection.associate = (models) => {
  ParkingCollection.belongsTo(models.User, {
    foreignKey: { allowNull: false },
  });
};

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Table created successfully! ");
  })
  .catch((error) => {
    console.error("Unable to create table : ");
  });

module.exports = ParkingCollection;
