import userHealthRecordModel from "../models/userHealthRecords.js";
import userModel from "../models/users.js";
import hospitalModel from "../models/hospitals.js";
import doctorModel from "../models/doctors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";
import dotenv from "dotenv";
dotenv.config();
// healthRecordTitle, userAddharID, hospitalEmailID, doctorEmailID, date, documentType, documentLink
class userHealthRecordController {
  static addUHR = async (req, res) => {
    let {
      healthRecordTitle,
      userAddharID,
      doctorEmailID,
      date,
      documentType,
      documentLink,
    } = req.body;

    if (
      healthRecordTitle &&
      userAddharID &&
      doctorEmailID &&
      date &&
      documentType &&
      documentLink
    ) {
      try {
        date = new Date(date);
        const newUserHealthRecord = new userHealthRecordModel({
          healthRecordTitle: healthRecordTitle,
          userAddharID: userAddharID,
          hospitalEmailID: req.hospital.email,
          doctorEmailID: doctorEmailID,
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
        res.send({ status: "failed", message: "Unable to add...." });
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
        userAddharID,
        doctorEmailID,
        date,
        documentType,
        documentLink,
      } = req.body;
      const UHR = await userHealthRecordModel.findById(id);
      if (!UHR) {
        return res.send({
          status: "failed",
          message: "Given ID is incorrect ....",
        });
      } else {
        await UHRModel.findByIdAndUpdate(id, {
          $set: {
            healthRecordTitle: healthRecordTitle,
            userAddharID: userAddharID,
            hospitalEmailID: req.hospital.email,
            doctorEmailID: doctorEmailID,
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
      res.send({ status: "failed", message: "Unable to update UHR...." });
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
      res.send({ status: "failed", message: "Unable to delete UHR...." });
    }
  };
  static getUHR = async (req, res) => {
    if (req.userHealthRecord.type === "hospital") {
      const hospital1 = await hospitalModel.findById(
        req.userHealthRecord.hospitalID
      );
      const result = await userHealthRecordModel.find({
        hospitalEmailID: hospital1.email,
      });
      res.send({ userHealthRecord: result });
    } else if (req.userHealthRecord.type === "user") {
      const user1 = await userModel.findById(req.userHealthRecord.userID);
      const result = await userHealthRecordModel.find({
        userAddharID: user1.addharID,
      });
      res.send({ userHealthRecord: result });
    } else if (req.userHealthRecord.type === "doctor") {
      const doctor1 = await doctorModel.findById(req.userHealthRecord.doctorID);
      const result = await userHealthRecordModel.find({
        doctorEmailID: doctor1.email,
      });
      res.send({ userHealthRecord: result });
    }
  };
  static filterUHR = async (req, res) => {
    const { start, limit } = req.query;
    if (req.userHealthRecord.type === "hospital") {
      const hospital1 = await hospitalModel.findById(
        req.userHealthRecord.hospitalID
      );
      const result = await userHealthRecordModel
        .find({
          hospitalEmailID: hospital1.email,
        })
        .skip(parseInt(start))
        .limit(parseInt(limit));
      res.send({ userHealthRecord: result });
    } else if (req.userHealthRecord.type === "user") {
      const user1 = await userModel.findById(req.userHealthRecord.userID);
      const result = await userHealthRecordModel
        .find({
          userAddharID: user1.addharID,
        })
        .skip(parseInt(start))
        .limit(parseInt(limit));
      res.send({ userHealthRecord: result });
    } else if (req.userHealthRecord.type === "doctor") {
      const doctor1 = await doctorModel.findById(req.userHealthRecord.doctorID);
      const result = await userHealthRecordModel
        .find({
          doctorEmailID: doctor1.email,
        })
        .skip(parseInt(start))
        .limit(parseInt(limit));
      res.send({ userHealthRecord: result });
    }
    const records = await Record.find();
  };
}

export default userHealthRecordController;
