const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");

//controllers
const {
  getAllUser,
  addUser,
  deleteUser,
  getAllTenant,
  getSingleTenant,
  addTenant,
  editTenant,
  deleteTenant,
  getAllUnit,
  addUnit,
  updateUnit,
  upload,
  getAllTransactions,
  getTenantTransactions,
  getAllInvoice,
  addInvoice,
  addTransaction,
  getTenantInvoices,
  getAllParkingCollections,
  editContract,
  getUtility,
  editUtility,
  addParkingCollection,
  getSingleUser,
  editUser,
  setElectricBill,
  setWaterBill,
  endContract,
  changePassword,
  getSingleUnit,
  deleteUnit,
  getAllArchive,
  permanentdeleteTenant,
  recoverTenant,
} = require("../controllers/userController");

router
  .get("/tenants", authenticateToken, getAllTenant)
  .post("/tenants/add", authenticateToken, addTenant)
  .get("/tenants/archived", authenticateToken, getAllArchive)
  .get("/tenants/:id", authenticateToken, getSingleTenant)
  .patch("/tenants/edit/:id", authenticateToken, editTenant)
  .delete("/tenants/delete/:id", authenticateToken, deleteTenant)
  .delete(
    "/tenants/permanentdelete/:id",
    authenticateToken,
    permanentdeleteTenant
  )
  .patch("/tenants/recover/:id", recoverTenant);

router
  .patch("/lease/edit/:id", authenticateToken, editContract)
  .patch("/lease/end/:id", authenticateToken, endContract);
router
  .patch("/bill/electricity", authenticateToken, setElectricBill)
  .patch("/bill/water", authenticateToken, setWaterBill);
router.post("/upload/:type", authenticateToken, upload);
router
  .get("/property-units", authenticateToken, getAllUnit)
  .post("/property-units/add", authenticateToken, addUnit)
  .patch("/property-units/update/:id", authenticateToken, updateUnit)
  .get("/property-units/:id", authenticateToken, getSingleUnit)
  .delete("/property-units/delete/:id", authenticateToken, deleteUnit);
router
  .get("/transactions", authenticateToken, getAllTransactions)
  .post("/transactions/add", authenticateToken, addTransaction)
  .get("/transactions/:id", authenticateToken, getTenantTransactions);
router
  .get("/invoices", authenticateToken, getAllInvoice)
  .post("/invoices/add", authenticateToken, addInvoice)
  .get("/invoices/:id", authenticateToken, getTenantInvoices);
router
  .get("/parking_collections", authenticateToken, getAllParkingCollections)
  .post("/parking_collections/add", authenticateToken, addParkingCollection);
router
  .get("/utility", authenticateToken, getUtility)
  .patch("/utility", authenticateToken, editUtility);

router
  .get("/users", authenticateToken, getAllUser)
  .post("/users/add", authenticateToken, addUser)
  .get("/users/:id", authenticateToken, getSingleUser)
  .patch("/users/edit/:id", authenticateToken, editUser)
  .delete("/users/delete/:id", authenticateToken, deleteUser);
router.patch("/change-password/:id", authenticateToken, changePassword);

module.exports = router;
