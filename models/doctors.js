import mongoose from "mongoose";

const doctorsSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  contactNo: { type: String, required: true, trim: true },
  localAddress: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  subSpeciality: [{ type: String, required: true, trim: true }],
});

export default doctorsSchema;
