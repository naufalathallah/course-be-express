const express = require("express");
const validator = require("express-validator");

const placesControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({ message: "api mern" });
});

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.post("/", placesControllers.createPlace);

router.patch("/:pid", placesControllers.updatePlace);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
