const uuid = require("uuid");

const HttpError = require("../models/http-error");

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
    creator: "Raja Samaratungga",
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
    creator: "Kaisar Shah Jahan",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    return next(
      new HttpError("tidak bisa menemukan tempat dari id yang diberikan", 404)
    );
  }

  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return next(
      new HttpError(
        "tidak bisa menemukan tempat dari id user yang diberikan",
        404
      )
    );
  }

  res.json({ place });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid.v4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "tempat terhapus" });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
