const asyncWrapper = require("../middlewares/asyncWrapper");
const Admin = require("../models/admin.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      appError.create(
        "Please provide email and password",
        400,
        httpStatus.FAIL,
      ),
    );
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    return next(
      appError.create("email or password is incorrect", 401, httpStatus.FAIL),
    );
  }

  const isPasswordCorrect = await bcryptjs.compare(password, admin.password);

  if (!isPasswordCorrect) {
    return next(
      appError.create("email or password is incorrect", 401, httpStatus.FAIL),
    );
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "30m",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod" ? true : false,
    sameSite: process.env.NODE_ENV === "prod" ? "None" : "Lax",
    maxAge: 30 * 60 * 1000,
  });

  admin.password = undefined;
  admin.__v = undefined;

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { admin },
  });
});

const logout = asyncWrapper(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod" ? true : false,
    sameSite: process.env.NODE_ENV === "prod" ? "None" : "Lax",
  });
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Logged out successfully",
  });
});

module.exports = {
  login,
  logout,
};
