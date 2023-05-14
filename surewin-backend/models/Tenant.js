const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connect");

const Tenant = sequelize.define("tenant", {
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
  email: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  valid_id: {
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
    allowNull: true,
  },
  user_role: {
    type: DataTypes.STRING,
    defaultvalue: "tenant",
  },
  account_status: {
    type: DataTypes.STRING,
  },
});

Tenant.associate = (models) => {
  Tenant.hasMany(models.Contract);
  Tenant.hasMany(models.Transaction);
  Tenant.hasMany(models.Invoice);
};
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ");
  });

module.exports = Tenant;
