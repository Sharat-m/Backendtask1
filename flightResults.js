// FlightResult.js
const mongoose = require('mongoose');

const flightResultSchema = new mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  adults: Number,
  children: Number,
  infants: Number,
  cabin_class: String,
  trip_type: String,
});

const FlightResult = mongoose.model('FlightResult', flightResultSchema);

module.exports = FlightResult;
