import hospitalModel from "../models/hospitals.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";
import dotenv from "dotenv";
dotenv.config();
// name, email, password, registrationNo, contactNo_1, contactNo_2, localAddress, city, district, state, speciality
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
            { hospitalID: saved_hospital._id, type: "hospital" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }
          );
          res.status(201).send({
            status: "Success",
            message: "registeration sucessfully....",
            token: token,
          });
        } catch (error) {
          res.send({ status: "failed", message: "Unable to register...." });
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
              { hospitalID: hospital._id, type: "hospital" },
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
      res.status(400).send({ status: "failed", message: "Unable to login..." });
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
    res.send({ hospital: req.hospital });
  };
  static sendHospitalPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.send({ status: "failed", message: "email field is required..." });
    } else {
      const hospital = await hospitalModel.findOne({ email: email });
      if (!hospital) {
        res.send({ status: "failed", message: "email doesnt exists" });
      } else {
        const secret = hospital._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ hospitalID: hospital._id }, secret, {
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
  };
  static hospitalPasswordReset = async (req, res) => {
    const { password } = req.body;
    const { id, token } = req.params;
    const hospital = await hospitalModel.findById(id);
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
      res.send({ status: "failed", message: "Invalid token" });
    }
  };
}

export default hospitalController;
