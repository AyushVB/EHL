import userModel from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";
import dotenv from "dotenv";
dotenv.config();
// firstName, middleName, lastName, email, password, dateOfBirth, PAN_id, aadharId, mobile, emergencyMobile, localAddress, city, district, state, gender, image, ABHA_id, bloodGroup, longLifeDisease
class userController {
  static userRegistration = async (req, res) => {
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      dateOfBirth,
      PAN_id,
      aadharId,
      mobile,
      emergencyMobile,
      localAddress,
      city,
      district,
      state,
      gender,
      image,
      ABHA_id,
      bloodGroup,
      longLifeDisease,
    } = req.body;
    const user = await userModel.findOne({ aadharId: aadharId });
    if (user) {
      res.send({ status: "failed", message: "addhar Id already exists" });
    } else {
      if (
        firstName &&
        middleName &&
        lastName &&
        email &&
        password &&
        dateOfBirth &&
        PAN_id &&
        aadharId &&
        mobile &&
        emergencyMobile &&
        localAddress &&
        city &&
        district &&
        state &&
        gender &&
        image &&
        ABHA_id &&
        bloodGroup &&
        longLifeDisease
      ) {
        try {
          const salt = await bcrypt.genSalt(12);
          const hashPassword = await bcrypt.hash(password, salt);

          const newUser = new userModel({
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            email: email,
            password: hashPassword,
            dateOfBirth: dateOfBirth,
            PAN_id: PAN_id,
            aadharId: aadharId,
            mobile: mobile,
            emergencyMobile: emergencyMobile,
            localAddress: localAddress,
            city: city,
            district: district,
            state: state,
            gender: gender,
            image: image,
            ABHA_id: ABHA_id,
            bloodGroup: bloodGroup,
            longLifeDisease: longLifeDisease,
          });
          await newUser.save();

          // JWT create
          const saved_user = await userModel.findOne({ aadharId: aadharId });
          const token = jwt.sign(
            { userId: saved_user._id, type: "user" },
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
  static userLogin = async (req, res) => {
    try {
      const { aadharId, password } = req.body;
      if (aadharId && password) {
        const user = await userModel.findOne({ aadharId: aadharId });
        if (!user) {
          res
            .status(400)
            .send({ status: "failed", message: "You are not register user.." });
        } else {
          const ismatch = await bcrypt.compare(password, user.password);
          if (ismatch && user.aadharId === aadharId) {
            // JWT create
            const token = jwt.sign(
              { userId: user._id, type: "user" },
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
              message: "AddharId or Password is invalId",
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
  static changeUserPassword = async (req, res) => {
    const { password } = req.body;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await userModel.findByIdAndUpdate(req.user._id, {
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
  static loggedUser = async (req, res) => {
    res.send({
      status: "success",
      user: req.user,
    });
  };
  static fetchByAadharId = async (req, res) => {
    try {
      const { aadharId } = req.query;
      if (aadharId) {
        const user = await userModel.findOne({ aadharId: aadharId });
        if (!user) {
          res
            .status(400)
            .send({ status: "failed", message: "You are not register user.." });
        } else {
          res.send({
            status: "success",
            user: user,
          });
        }
      } else {
        res.send({ status: "failed", message: "Addhar Id field is required" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to get details of user...",
      });
    }
  };
  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.send({ status: "failed", message: "email field is required..." });
    } else {
      const user = await userModel.findOne({ email: email });
      if (!user) {
        res.send({ status: "failed", message: "email doesnt exists" });
      } else {
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userId: user._id }, secret, {
          expiresIn: "15m",
        });
        const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`;

        // sent email
        const info = transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
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
  static userPasswordReset = async (req, res) => {
    const { password } = req.body;
    const { Id, token } = req.params;
    const user = await userModel.findById(Id);
    const secret = user._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, secret);
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await userModel.findByIdAndUpdate(user._id, {
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
      res.send({ status: "failed", message: "InvalId token" });
    }
  };
}

export default userController;
