import mongoose from "mongoose";

const travelSchema = new mongoose.Schema({
  travelToken: {
    type: String,
  },
  userToken: {
    type: [String],
    default: null,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  vehicleNumber: {
    type: String,
  },

  driverReview: {
    type: Number,
  },
});

const travelSchemaSave =
  mongoose.models.travelSchema ||
  mongoose.model("travelSchemasave", travelSchema);

export default travelSchemaSave;
