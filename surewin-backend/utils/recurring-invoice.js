const Tenant = require("../models/Tenant");
const Contract = require("../models/Contract");
const Invoice = require("../models/Invoice");

async function fetchData() {
  const tenant = await Tenant.findAll();
  const contract = await Contract.findAll();
  return {
    tenant,
    contract,
    Invoice,
  };
}
module.exports = { fetchData };
