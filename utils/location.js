const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyAaIqt5wjWCXvBLN6aw6TTaAKd9_xC7PzI";

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("tiddak bisa menemukan lokasi", 422);
    throw error;
  }
  let coordinates = "";
  if (data.status === "REQUEST_DENIED") {
    return (coordinates = {
      lat: 41.7484474,
      lng: -53.9871516,
    });
  }
  coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;
