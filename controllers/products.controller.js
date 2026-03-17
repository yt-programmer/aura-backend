const httpStatus = require("../utils/httpStatus");

const Product = require("../models/product.model");

const appError = require("../utils/appError");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getProducts = asyncWrapper(async (req, res) => {
  const q = req.query;
  const page = parseInt(q.page) || 1;
  const limit = parseInt(q.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find({}, { __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  res.json({
    status: httpStatus.SUCCESS,
    page,
    results: products.length,
    data: { products },
  });
});

const createProduct = asyncWrapper(async (req, res, next) => {
  const { name, description, image, price } = req.body;

  if (!name || !description || !image || !price) {
    return next(
      appError.create("All fields are required", 400, httpStatus.FAIL),
    );
  }

  const product = await new Product({
    price,
    name,
    description,
    image,
  });
  await product.save();

  const products = await Product.find({}, { __v: 0 }).sort({ createdAt: -1 });

  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: { products },
  });
});
const editProduct = asyncWrapper(async (req, res, next) => {
  const { name, description, image, price } = req.body;
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    { _id: req.params.id, name, description, image, price },
  );

  if (!product) {
    return next(appError.create("Product not found", 404, httpStatus.FAIL));
  }

  await product.save();

  const products = await Product.find({}, { __v: 0 }).sort({ createdAt: -1 });

  res.json({
    status: httpStatus.SUCCESS,
    data: { products },
  });
});

const deleteProduct = asyncWrapper(async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id });
  if (!product) {
    return next(appError.create("Product not found", 404, httpStatus.FAIL));
  }

  const products = await Product.find({}, { __v: 0 }).sort({ createdAt: -1 });

  res.json({
    status: httpStatus.SUCCESS,
    data: { products },
  });
});

module.exports = {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
};
