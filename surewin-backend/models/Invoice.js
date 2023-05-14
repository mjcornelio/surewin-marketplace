const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = require("../db/connect");

const Invoice = sequelize.define("invoices", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "tenants",
      key: "id",
    },
  },
  amount_to_paid: {
    type: DataTypes.INTEGER,
  },
  received: {
    type: DataTypes.INTEGER,
  },
  balance: {
    type: DataTypes.INTEGER,
  },
  payment_for: {
    type: DataTypes.STRING,
  },
  due_date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM,
    values: ["Paid", "Unpaid", "Partial"],
  },
  description: {
    type: DataTypes.STRING,
  },
});

Invoice.associate = (models) => {
  Invoice.belongsTo(models.Tenant, {
    foreignKey: { allowNull: false },
    onDelete: "Cascade",
  });
  Invoice.hasMany(models.Transaction, {
    foreignKey: { allowNull: false },
    onDelete: "Cascade",
  });
};

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : Invoice");
  });

module.exports = Invoice;
