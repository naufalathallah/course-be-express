require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
// comment for practice
// const mongoPractice = require("./mongo");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();
const url = process.env.DATABASE_URL;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
// comment for practice
// app.post("/products", mongoPractice.createProduct);
// app.get("/products", mongoPractice.getProducts);

app.use((req, res, next) => {
  const error = new HttpError("tidak bisa menemukan route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "error tidak diketahui" });
});

mongoose
  .connect(url)
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
