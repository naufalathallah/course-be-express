const express = require("express");

const placesControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("get req in places");
  res.json({ message: "it worked" });
});

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlaceByUserId);

router.post("/", placesControllers.createPlace);

module.exports = router;
