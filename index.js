const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP",
});

app.use("/api", limiter);
const port = process.env.PORT || 5000;
const URL = process.env.MONGO_URL;
const httpStatus = require("./utils/httpStatus");
const productsRouter = require("./routes/products.route");
const adminRouter = require("./routes/admin.route");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

mongoose
  .connect(URL)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log("Error DB =>", err));

app.use("/api/products", productsRouter);
app.use("/api/auth", adminRouter);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || httpStatus.ERROR,
    message: err.message || "Something went wrong",
    code: err.statusCode || 500,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
