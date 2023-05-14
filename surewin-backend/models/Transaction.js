const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = require("../db/connect");

const Transaction = sequelize.define("transaction", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "tenants",
      key: "id",
      onDelete: "restrict",
    },
  },
  invoice_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "invoices",
      key: "id",
    },
  },
  received_amount: {
    type: DataTypes.INTEGER,
  },
  payment_method: {
    type: DataTypes.ENUM,
    values: ["Cash", "Online"],
  },
  payment_date: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.STRING,
  },
});

Transaction.associate = (models) => {
  Transaction.belongsTo(models.Tenant, {
    foreignKey: { allowNull: false },
    onDelete: "Cascade",
  });
  Transaction.belongsTo(models.Invoice, {
    foreignKey: { allowNull: false },
    onDelete: "Cascade",
  });
};

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Table created successfully! Transaction");
  })
  .catch((error) => {
    console.error("Unable to create table : Transaction ");
  });

module.exports = Transaction;
