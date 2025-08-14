import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  alcoholic: {
    type: Boolean,
    required: true,
  },
  smoke: {
    type: Boolean,
    required: true,
  },
  married: {
    type: Boolean,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  ageRange: {
    type: String,
    required: true,
  },
});

const tripSchemaSave =
  mongoose.models.tripSchema || mongoose.model("tripSchemasave", tripSchema);

export default tripSchemaSave;
