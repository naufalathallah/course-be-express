const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
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

router.get("/", (req, res, next) => {
  console.log("get req in places");
  res.json({ message: "it worked" });
});

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  res.json({ place });
});

module.exports = router;
