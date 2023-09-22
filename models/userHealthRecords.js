import mongoose from "mongoose";

const userHealthRecordsSchema = new mongoose.Schema({
  healthRecordTitle: { type: String, required: true, trim: true },
  userAddharID: { type: String, required: true, trim: true },
  hospitalEmailID: { type: String, required: true, trim: true },
  doctorEmailID: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  documentType: { type: String, required: true, trim: true },
  documentLink: { type: String, required: true, trim: true },
});

export default userHealthRecordsSchema;
