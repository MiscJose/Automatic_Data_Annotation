const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, red: "User" },
  title: String,
  points: [String],
  labels: [String],
  confidence: [String],
  annotation: String,
  model: String,
});

const DataModel = mongoose.model("Data", dataSchema);

module.exports = DataModel;
