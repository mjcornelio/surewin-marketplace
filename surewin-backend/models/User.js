const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connect");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    middlename: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
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
    user_role: {
      type: DataTypes.ENUM,
      values: ["admin", "manager", "parking staff"],
    },
    email: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    contact_number: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

User.associate = (models) => {
  User.hasMany(models.ParkingCollection, { onDelete: "Cascade" });
};

sequelize
  .sync()
  .then(() => {
    console.log("Table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ");
  });

module.exports = User;
