const uuid = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");
const User = require("../models/user");

let DUMMY_PLACES = [
  {
    id: "1",
    title: "Menara Eiffel",
    description:
      "Landmark ikonik Paris yang terbuat dari besi dan sering menjadi destinasi wisata populer.",
    location: {
      lat: 48.8584,
      lng: 2.2945,
    },
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, Prancis",
    creator: "Gustave Eiffel",
  },
  {
    id: "2",
    title: "Piramida Giza",
    description:
      "Salah satu dari Tujuh Keajaiban Dunia Kuno, terletak di Mesir.",
    location: {
      lat: 29.9792,
      lng: 31.1342,
    },
    address: "Al Haram, Nazlet El-Semman, Kairo, Mesir",
    creator: "Firaun Khufu",
  },
  {
    id: "3",
    title: "Statue of Liberty",
    description:
      "Patung ikonik di New York yang merupakan simbol kebebasan dan demokrasi.",
    location: {
      lat: 40.6892,
      lng: -74.0445,
    },
    address: "Liberty Island, New York, NY 10004, Amerika Serikat",
    creator: "Frederic Auguste Bartholdi",
  },
  {
    id: "4",
    title: "Borobudur",
    description:
      "Candi Buddha terbesar di dunia yang terletak di Jawa Tengah, Indonesia.",
    location: {
      lat: -7.6079,
      lng: 110.2038,
    },
    address:
      "Jl. Badrawati, Kw. Candi Borobudur, Borobudur, Magelang, Jawa Tengah, Indonesia",
    creator: "u3",
  },
  {
    id: "5",
    title: "Taj Mahal",
    description:
      "Mausoleum marmer putih megah di Agra, India, yang dibangun oleh Kaisar Shah Jahan untuk mengenang istrinya.",
    location: {
      lat: 27.1751,
      lng: 78.0421,
    },
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh, India",
    creator: "u3",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Tidak dapat menemukan tempat", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "tidak bisa menemukan tempat dari id yang diberikan",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
