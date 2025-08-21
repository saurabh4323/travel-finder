import mongoose from "mongoose";

const SecduleSchema = new mongoose.Schema({
  traveltoken: {
    type: String,
  },
  userToken: {
    type: String,
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
});

// 👇 Keep model name consistent everywhere
const SecduleSchemaSave =
  mongoose.models.SecduleSchemasave ||
  mongoose.model("SecduleSchemasave", SecduleSchema);

export default SecduleSchemaSave;
