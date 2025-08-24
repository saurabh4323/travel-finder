import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  location: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
  },
  drivingLicensePhoto: {
    type: String,
  },
  driverPhoto: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  OTP: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
});

const driverSchemasave =
  mongoose.models.driverSchemasave ||
  mongoose.model("driverSchemasave", driverSchema);

export default driverSchemasave;
