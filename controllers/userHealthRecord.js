import userHealthRecordModel from "../models/userHealthRecords.js";
import userModel from "../models/users.js";
import hospitalModel from "../models/hospitals.js";
import doctorModel from "../models/doctors.js";
import dotenv from "dotenv";
dotenv.config();

// healthRecordTitle, userAadharId, hospitalEmailId, doctorEmailId, date, documentType, documentLink
class userHealthRecordController {
  static addUHR = async (req, res) => {
    let {
      healthRecordTitle,
      userAadharId,
      doctorEmailId,
      date,
      documentType,
      documentLink,
    } = req.body;

    if (
      healthRecordTitle &&
      userAadharId &&
      doctorEmailId &&
      date &&
      documentType &&
      documentLink
    ) {
      try {
        date = new Date(date);
        const newUserHealthRecord = new userHealthRecordModel({
          healthRecordTitle: healthRecordTitle,
          userAadharId: userAadharId,
          hospitalEmailId: req.hospital.email,
          doctorEmailId: doctorEmailId,
          date: date,
          documentType: documentType,
          documentLink: documentLink,
        });
        await newUserHealthRecord.save();

        res.status(201).send({
          status: "Success",
          message: "UHR added sucessfully....",
        });
      } catch (error) {
        res.send({
          status: "failed",
          message: "Unable to add....",
          error: error.message,
        });
        console.log(error);
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  };
  static updateUHR = async (req, res) => {
    try {
      var {
        id,
        healthRecordTitle,
        userAadharId,
        doctorEmailId,
        date,
        documentType,
        documentLink,
      } = req.body;
      const UHR = await userHealthRecordModel.findById(id);
      if (!UHR) {
        return res.send({
          status: "failed",
          message: "Given Id is incorrect ....",
        });
      } else {
        await userHealthRecordModel.findByIdAndUpdate(id, {
          $set: {
            healthRecordTitle: healthRecordTitle,
            userAadharId: userAadharId,
            hospitalEmailId: req.hospital.email,
            doctorEmailId: doctorEmailId,
            date: date,
            documentType: documentType,
            documentLink: documentLink,
          },
        });
        res.send({
          status: "Success",
          message: "updated ...",
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Unable to update UHR....",
        error: error.message,
      });
    }
  };
  static deleteUHR = async (req, res) => {
    try {
      const id = req.query.id;
      const UHR = await userHealthRecordModel.findById(id);
      if (!UHR) {
        res.send({ status: "failed", message: "UHR id is incorrect...." });
      } else {
        await userHealthRecordModel.findByIdAndDelete(id);
        res.send({ status: "success", message: "delete UHR successfully..." });
      }
    } catch (error) {
      res.send({
        status: "failed",
        message: "Unable to delete UHR....",
        error: error.message,
      });
    }
  };
  static getUHR = async (req, res) => {
    if (req.userHealthRecord.type === "hospital") {
      const hospital1 = await hospitalModel.findById(
        req.userHealthRecord.hospitalId
      );
      const result = await userHealthRecordModel.find({
        hospitalEmailId: hospital1.email,
      });
      res.send({ userHealthRecord: result });
    } else if (req.userHealthRecord.type === "user") {
      const user1 = await userModel.findById(req.userHealthRecord.userId);
      const result = await userHealthRecordModel.find({
        userAadharId: user1.aadharId,
      });
      res.send({ userHealthRecord: result });
    } else if (req.userHealthRecord.type === "doctor") {
      const doctor1 = await doctorModel.findById(req.userHealthRecord.doctorId);
      const result = await userHealthRecordModel.find({
        doctorEmailId: doctor1.email,
      });
      res.send({ userHealthRecord: result });
    }
  };
  static filterUHR = async (req, res) => {
    const { start, limit } = req.query;
    if (req.userHealthRecord.type === "hospital") {
      const hospital1 = await hospitalModel.findById(
        req.userHealthRecord.hospitalId
      );
      const result = await userHealthRecordModel
        .find({
          hospitalEmailId: hospital1.email,
        })
        .skip(parseInt(start))
        .limit(parseInt(limit));
      res.send({ userHealthRecord: result });
    } else if (req.userHealthRecord.type === "user") {
      const user1 = await userModel.findById(req.userHealthRecord.userId);
      const result = await userHealthRecordModel
        .find({
          userAadharId: user1.aadharId,
        })
        .skip(parseInt(start))
        .limit(parseInt(limit));
      res.send({ userHealthRecord: result });
    } else if (req.userHealthRecord.type === "doctor") {
      const doctor1 = await doctorModel.findById(req.userHealthRecord.doctorId);
      const result = await userHealthRecordModel
        .find({
          doctorEmailId: doctor1.email,
        })
        .skip(parseInt(start))
        .limit(parseInt(limit));
      res.send({ userHealthRecord: result });
    }
  };
}

export default userHealthRecordController;
