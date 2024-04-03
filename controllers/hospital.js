import hospitalModel from "../models/hospitals.js";
import userModel from "../models/users.js";
import userHealthRecordModel from "../models/userHealthRecords.js";
import verificationModel from "../models/verification.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";
import dotenv from "dotenv";
dotenv.config();
// name, email, password, registrationNo, contactNo_1, contactNo_2, localAddress, city, district, state, speciality

function generateOTP() {
  // Generate a random number between 100000 and 999999
  var OTP = Math.floor(100000 + Math.random() * 900000);
  return OTP.toString(); // Convert the number to a string
}

class hospitalController {
  static hospitalRegistration = async (req, res) => {
    const {
      name,
      email,
      password,
      registrationNo,
      contactNo_1,
      contactNo_2,
      localAddress,
      city,
      district,
      state,
      speciality,
    } = req.body;
    const hospital = await hospitalModel.findOne({ email: email });
    if (hospital) {
      res.send({ status: "failed", message: "email already exists" });
    } else {
      if (
        name &&
        email &&
        password &&
        registrationNo &&
        contactNo_1 &&
        contactNo_2 &&
        localAddress &&
        city &&
        district &&
        state &&
        speciality
      ) {
        try {
          const salt = await bcrypt.genSalt(12);
          const hashPassword = await bcrypt.hash(password, salt);

          const newHospital = new hospitalModel({
            name: name,
            email: email,
            password: hashPassword,
            registrationNo: registrationNo,
            contactNo_1: contactNo_1,
            contactNo_2: contactNo_2,
            localAddress: localAddress,
            city: city,
            district: district,
            state: state,
            speciality: speciality,
          });
          await newHospital.save();

          // JWT create
          const saved_hospital = await hospitalModel.findOne({ email: email });
          const token = jwt.sign(
            { hospitalId: saved_hospital._id, type: "hospital" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }
          );
          res.status(201).send({
            status: "Success",
            message: "registeration sucessfully....",
            token: token,
          });
        } catch (error) {
          res.send({
            status: "failed",
            message: "Unable to register....",
            error: error.message,
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    }
  };
  static hospitalLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const hospital = await hospitalModel.findOne({ email: email });
        if (!hospital) {
          res.status(400).send({
            status: "failed",
            message: "You are not register hospital..",
          });
        } else {
          const ismatch = await bcrypt.compare(password, hospital.password);
          if (ismatch && hospital.email === email) {
            // JWT create
            const token = jwt.sign(
              { hospitalId: hospital._id, type: "hospital" },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2d" }
            );
            res.send({
              status: "success",
              message: "login successfully...",
              token: token,
            });
          } else {
            res.status(400).send({
              status: "failed",
              message: "Email or Password is invalid",
            });
          }
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to login...",
        error: error.message,
      });
    }
  };
  static deleteHospital = async (req, res) => {
    try {
      const hospital = await hospitalModel.findById(req.hospital._id);
      if (!hospital) {
        res.send({ status: "failed", message: "hospital id is incorrect...." });
      } else {
        await hospitalModel.findByIdAndDelete(req.hospital._id);
        res.send({
          status: "success",
          message: "delete hospital successfully...",
        });
      }
    } catch (error) {
      res.send({
        status: "failed",
        message: "Unable to delete hospital....",
        error: error.message,
      });
    }
  };
  static changeHospitalPassword = async (req, res) => {
    const { password } = req.body;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await hospitalModel.findByIdAndUpdate(req.hospital._id, {
        $set: { password: hashPassword },
      });
      res.send({
        status: "success",
        message: "password change successfully...",
      });
    } else {
      res.send({ status: "failed", message: "Password field is required" });
    }
  };
  static loggedHospital = async (req, res) => {
    res.send({
      status: "success",
      hospital: req.hospital,
    });
  };
  static sendOTP = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        res.send({ status: "failed", message: "email field is required..." });
      } else {
        const user = await userModel
          .findOne({ email: email })
          .select("-password");

        if (!user) {
          res.send({ status: "failed", message: "email doesnt exists" });
        } else {
          const OTP = generateOTP();
          const secret = process.env.JWT_SECRET_KEY;
          const token = jwt.sign({ email: email, OTP: OTP }, secret, {
            expiresIn: "20m",
          });

          const verification = await verificationModel.findOne({
            email: email,
          });
          if (verification) {
            await verificationModel.findByIdAndDelete(verification._id);
          }

          const newVerification = new verificationModel({
            email: email,
            token: token,
          });
          await newVerification.save();

          // sent email
          const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "OTP for retreive health record",
            html: `<p>OTP is <b>${OTP}</b></p>`,
          });
          res.send({
            status: "success",
            message:
              "OTP is sent, please check email. verify otp before 20 min",
            info: info,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to send OTP...",
        error: error.message,
      });
    }
  };
  static verifyOTP = async (req, res) => {
    const { email, OTP } = req.body;
    try {
      if (email && OTP) {
        const user = await userModel
          .findOne({ email: email })
          .select("-password");

        if (!user) {
          res.send({ status: "failed", message: "email doesnt exists" });
        } else {
          const verification = await verificationModel.findOne({
            email: email,
          });
          // verify token
          jwt.verify(
            verification.token,
            process.env.JWT_SECRET_KEY,
            async (err, verficationData) => {
              if (err) {
                return res.status(403).send({
                  status: "failed",
                  message: "Authentication refused",
                });
              }
              if (
                !(verficationData.OTP === OTP && verficationData.email == email)
              ) {
                return res.status(403).send({
                  status: "failed",
                  message: "Authentication refused 1",
                });
              }
              const result = await userHealthRecordModel.find({
                userAadharId: user.aadharId,
              });
              res.send({ userHealthRecord: result });
            }
          );
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Unable to verify",
        error: error.message,
      });
    }
  };
  static patientEmergencyInfo = async (req, res) => {
    try {
      const { aadharId } = req.query;
      if (aadharId) {
        const user = await userModel
          .findOne({ aadharId: aadharId })
          .select("-password");
        if (!user) {
          res
            .status(400)
            .send({ status: "failed", message: "Addhar id is invalid.." });
        } else {
          if (user.aadharId === aadharId) {
            res.send({
              status: "success",
              user: user,
            });
          } else {
            res.status(400).send({
              status: "failed",
              message: "AddharId or Password is invalid",
            });
          }
        }
      } else {
        res.send({ status: "failed", message: "Addhar id field is required" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to fetch data...",
        error: error.message,
      });
    }
  };
  static sendHospitalPasswordResetEmail = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        res.send({ status: "failed", message: "email field is required..." });
      } else {
        const hospital = await hospitalModel.findOne({ email: email });
        if (!hospital) {
          res.send({ status: "failed", message: "email doesnt exists" });
        } else {
          const secret = hospital._id + process.env.JWT_SECRET_KEY;
          const token = jwt.sign({ hospitalId: hospital._id }, secret, {
            expiresIn: "15m",
          });
          const link = `http://localhost:3000/api/hospital/reset/${hospital._id}/${token}`;

          // sent email
          const info = transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: hospital.email,
            subject: "API-Password Reset Link",
            html: `<a href=${link}>click here</a>to reset your password in next 15 min.`,
          });
          res.send({
            status: "success",
            message: "password reset email is sent....please check email.. ",
            info: info,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to send email...",
        error: error.message,
      });
    }
  };
  static hospitalPasswordReset = async (req, res) => {
    const { password } = req.body;
    const { id, token } = req.params;

    let hospital;
    try {
      hospital = await hospitalModel.findById(id);
    } catch (error) {
      res.send({
        status: "failed",
        message: "This is not register hospital",
        error: error.message,
      });
      return;
    }

    const secret = hospital._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, secret);
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await hospitalModel.findByIdAndUpdate(hospital._id, {
          $set: { password: hashPassword },
        });
        res.send({
          status: "success",
          message: "password reset successfully...",
        });
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Invalid token",
        error: error.message,
      });
    }
  };
}

export default hospitalController;
