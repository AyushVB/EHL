import doctorModel from "../models/doctors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";
import dotenv from "dotenv";
dotenv.config();
// name, email, password, dateOfBirth, gender, degree, contactNo, localAddress, city, district, state, specialty, subSpeciality
class doctorController {
  static doctorRegistration = async (req, res) => {
    const {
      name,
      email,
      password,
      dateOfBirth,
      gender,
      degree,
      contactNo,
      localAddress,
      city,
      district,
      state,
      specialty,
      subSpeciality,
    } = req.body;
    const doctor = await doctorModel.findOne({ email: email });
    if (doctor) {
      res.send({ status: "failed", message: "email already exists" });
    } else {
      if (
        name &&
        email &&
        password &&
        dateOfBirth &&
        gender &&
        degree &&
        contactNo &&
        localAddress &&
        city &&
        district &&
        state &&
        specialty &&
        subSpeciality
      ) {
        try {
          const salt = await bcrypt.genSalt(12);
          const hashPassword = await bcrypt.hash(password, salt);

          const newDoctor = new doctorModel({
            name: name,
            email: email,
            password: hashPassword,
            dateOfBirth: dateOfBirth,
            gender: gender,
            degree: degree,
            contactNo: contactNo,
            localAddress: localAddress,
            city: city,
            district: district,
            state: state,
            specialty: specialty,
            subSpeciality: subSpeciality,
          });
          await newDoctor.save();

          // JWT create
          const saved_doctor = await doctorModel.findOne({ email: email });
          const token = jwt.sign(
            { doctorID: saved_doctor._id, type: "doctor" },
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
  static doctorLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const doctor = await doctorModel.findOne({ email: email });
        if (!doctor) {
          res.status(400).send({
            status: "failed",
            message: "You are not register doctor..",
          });
        } else {
          const ismatch = await bcrypt.compare(password, doctor.password);
          if (ismatch && doctor.email === email) {
            // JWT create
            const token = jwt.sign(
              { doctorID: doctor._id, type: "doctor" },
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
  static changeDoctorPassword = async (req, res) => {
    const { password } = req.body;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await doctorModel.findByIdAndUpdate(req.doctor._id, {
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
  static loggedDoctor = async (req, res) => {
    res.send({
      status: "success",
      doctor: req.doctor,
    });
  };
  static sendDoctorPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.send({ status: "failed", message: "email field is required..." });
    } else {
      const doctor = await doctorModel.findOne({ email: email });
      if (!doctor) {
        res.send({ status: "failed", message: "email doesnt exists" });
      } else {
        const secret = doctor._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ doctorID: doctor._id }, secret, {
          expiresIn: "15m",
        });
        const link = `http://localhost:3000/api/doctor/reset/${doctor._id}/${token}`;

        // sent email
        const info = transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: doctor.email,
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
  static doctorPasswordReset = async (req, res) => {
    const { password } = req.body;
    const { id, token } = req.params;
    const doctor = await doctorModel.findById(id);
    const secret = doctor._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, secret);
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await doctorModel.findByIdAndUpdate(doctor._id, {
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

export default doctorController;
