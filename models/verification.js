import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true },
  token: { type: String, required: true },
});

// Model
const verificationModel = mongoose.model("verification", verificationSchema);

export default verificationModel;
