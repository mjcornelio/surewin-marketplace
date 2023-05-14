const User = require("../models/User");
const Tenant = require("../models/Tenant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js");
const Hogan = require("hogan.js");
const fs = require("fs");

const resetpasswordTemplate = fs.readFileSync(
  "./views/resetpassword.hjs",
  "utf-8"
);
const compileResetPassword = Hogan.compile(resetpasswordTemplate);

const login = async (req, res) => {
  let user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user == null) {
    user = await Tenant.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user == null) {
      return res.status(400).json({
        success: false,
        msg: "Incorrent email",
      });
    }
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const email = user.email;
      const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
      const { firstname, lastname, middlename, user_role, id, image } = user;
      return res.status(200).json({
        success: true,
        accessToken: accessToken,
        user: {
          image: image,
          firstname: firstname,
          lastname: lastname,
          middlename: middlename,
          user_role: user_role,
          id: id,
        },
      });
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "Incorrent password" });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Something went wrong, Please Try again Later",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User email is not exist",
      });
    }

    const DOMAIN = "surewinmarketplace.tech";
    const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
    const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });
    const data = {
      from: "noreply@surewinmarketplace.tech",
      to: email,
      subject: "Password Reset",
      html: compileResetPassword.render({
        firstname: user.firstname,
        lastname: user.lastname,
        link: `http://surewinmarketplace.tech/resetpassword/${user.id}/${token}`,
      }),
    };
    mg.messages().send(data, function (error, body) {
      if (error) {
        return res.status(400).json({
          success: false,
          msg: "Something went wrong, Please Try again Later",
          error: error,
          body: body,
        });
      } else {
        return res.status(200).json({
          success: true,
          msg: "Reset Password Link Successfully Sent",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      msg: "Something went wrong, Please Try again Later",
      error: error,
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { id, password, token } = req.body;
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User does not exist",
      });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.update({ password: hashedPassword }, { where: { id: id } });
    return res.status(200).json({
      success: true,
      msg: "Reset Password Successfully ",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Something went wrong, Please Try again Later",
    });
  }
};
const register = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      middlename,
      address,
      user_role,
      image,
      contact_number,
      email,
      username,
      password,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      firstname: firstname,
      lastname: lastname,
      middlename: middlename,
      address: address,
      user_role: user_role,
      image: image,
      contact_number: contact_number,
      email: email,
      username: username,
      password: hashedPassword,
    });
    res.status(201).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { login, register, forgotPassword, resetPassword };
