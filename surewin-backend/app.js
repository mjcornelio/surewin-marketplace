require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const reccur = require("./utils/recurring-invoice");

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect to Database
const connectDB = require("./db/connect");

//router
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

app.get("/", (req, res) => {
  res.send("Redd-Amber Surewin Wet and Dry Market");
});
//Recurring Payment for Rental and Monthly Billings
app.post("/recurring-rent", async (req, res) => {
  try {
    const response = await reccur.fetchData();
    const tenant = await response.tenant;
    let contract = await response.contract;
    const Invoice = await response.Invoice;

    let tempcontract = contract.filter((c) => c.rental_frequency === "Daily");
    tempcontract.forEach((c) => {
      Invoice.create({
        tenant_id: c.tenant_id,
        status: "Unpaid",
        payment_for: "Rent",
        amount_to_paid: c.rental_amount,
        due_date: new Date(),
        description: "Rental Collection",
        received: 0,
        balance: c.rental_amount,
      });
    });

    if (
      new Date() ===
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    ) {
      tempcontract = contract.filter((c) => c.rental_frequency === "Monthly");
      tempcontract.forEach((c) => {
        Invoice.create({
          tenant_id: c.tenant_id,
          status: "Unpaid",
          payment_for: "Rent",
          amount_to_paid:
            c.rental_amount *
            new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0
            ).getDate(),
          due_date: new Date(),
          description: "Rental Collection",
          received: 0,
          balance: c.rental_amount,
        });
      });
    }
    res.send(200).json({ success: true, msg: "Reccuring Invoice Posted" });
  } catch (error) {
    res
      .send(400)
      .json({ success: false, msg: "Something in the server went wrong" });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/", userRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB.authenticate();
    app.listen(port, console.log("successfully connected to Database"));
  } catch (error) {
    console.log(error);
    console.log("Something Went Wrong, Please Try Again Later");
  }
};

start();
