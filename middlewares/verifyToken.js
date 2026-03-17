const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(appError.create("You are not logged in", 401, httpStatus.FAIL));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;

    next();
  } catch (err) {
    return next(
      appError.create("Invalid or expired token", 401, httpStatus.FAIL),
    );
  }
};

module.exports = verifyToken;
