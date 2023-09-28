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
    return (coordinates = generateRandomCoordinates());
  }

  return (coordinates = data.results[0].geometry.location);
}

function generateRandomCoordinates() {
  const lat = Math.random() * 180 - 90;
  const lng = Math.random() * 360 - 180;

  return {
    lat: parseFloat(lat.toFixed(7)),
    lng: parseFloat(lng.toFixed(7)),
  };
}

module.exports = getCoordsForAddress;
