import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  registrationNo: { type: String, required: true, trim: true },
  contactNo_1: { type: String, required: true, trim: true },
  contactNo_2: { type: String, required: true, trim: true },
  localAddress: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  speciality: [{ type: String, required: true, trim: true }],
});

// Model
const hospitalModel = mongoose.model("hospital", hospitalSchema);

export default hospitalModel;
