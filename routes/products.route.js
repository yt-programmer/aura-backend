const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/products.controller");
const httpStatus = require("../utils/httpStatus");

const verifyToken = require("../middlewares/verifyToken");
const { body, param, validationResult } = require("express-validator");
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
  .route("/")
  .get(getProducts)
  .post(
    verifyToken,
    [
      body("price").isNumeric().withMessage("Price must be a number"),
      body("name").notEmpty().withMessage("Name is required"),
      body("description").notEmpty().withMessage("Description is required"),
      body("image").isURL().withMessage("Image must be a valid URL"),
    ],
    validateRequest,
    createProduct,
  );

router
  .route("/:id")
  .patch(
    verifyToken,
    [
      body("price")
        .optional()
        .isNumeric()
        .withMessage("Price must be a number"),
      param("id").isMongoId().withMessage("Invalid product ID"),
      body("name").optional().notEmpty().withMessage("Name cannot be empty"),
      body("description")
        .optional()
        .notEmpty()
        .withMessage("Description is required"),

      body("image").optional().isURL().withMessage("Image must be a valid URL"),
    ],
    validateRequest,
    editProduct,
  )
  .delete(
    verifyToken,
    [param("id").isMongoId().withMessage("Invalid product ID")],
    validateRequest,
    deleteProduct,
  );

module.exports = router;
