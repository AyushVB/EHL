import mongoose from "mongoose";

const userHealthRecordSchema = new mongoose.Schema({
  healthRecordTitle: { type: String, required: true, trim: true },
  userAadharId: { type: String, required: true, trim: true },
  userName: { type: String, required: true, trim: true },
  hospitalEmailId: { type: String, required: true, trim: true },
  hospitalName: { type: String, required: true, trim: true },
  doctorEmailId: { type: String, required: true, trim: true },
  doctorName: { type: String, required: true, trim: true },
  disease: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  documentType: { type: String, required: true, trim: true },
  documentLink: { type: String, required: true, trim: true },
});

// Model
const userHealthRecordModel = mongoose.model(
  "userHealthRecord",
  userHealthRecordSchema
);

export default userHealthRecordModel;
