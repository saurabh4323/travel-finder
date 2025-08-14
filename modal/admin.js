import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
});

const adminSchemasave =
  mongoose.models.adminSchemasave ||
  mongoose.model("adminSchemasave", adminSchema);

export default adminSchemasave;
