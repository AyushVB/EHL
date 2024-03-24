import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  PAN_Id: { type: String, required: true, trim: true },
  aadharId: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  emergencyMobile: { type: String, required: true, trim: true },
  localAddress: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  gender: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  ABHA_Id: { type: String, required: true, trim: true },
  bloodGroup: { type: String, required: true, trim: true },
  longLifeDisease: [{ type: String, required: true, trim: true }],
});

// Model
const userModel = mongoose.model("user", userSchema);

export default userModel;
