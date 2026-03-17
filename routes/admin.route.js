const express = require("express");
const router = express.Router();
const httpStatus = require("../utils/httpStatus");
const { login, logout } = require("../controllers/admin.controller");
const verifyToken = require("../middlewares/verifyToken");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { body, validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: httpStatus.FAIL,
      errors: errors.array(),
    });
  }
  next();
};
router
  .route("/login")
  .post(
    [
      body("email").isEmail(),
      body("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    ],
    validateRequest,
    login,
  );
router.route("/logout").post(verifyToken, logout);
router.route("/me").get(
  verifyToken,
  asyncWrapper(async (req, res) => {
    res.json({
      status: httpStatus.SUCCESS,
      data: { admin: req.admin },
    });
  }),
);

module.exports = router;
