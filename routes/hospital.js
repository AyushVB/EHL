import express from "express";
import hospitalController from "../controllers/hospital.js";
import checkHospitalAuth from "../middlewares/hospital-auth.js";

const router = express.Router();

// route level middleware
router.use("/delete", checkHospitalAuth);
router.use("/changePassword", checkHospitalAuth);
router.use("/loggedHospital", checkHospitalAuth);
router.use("/sendOTP", checkHospitalAuth);
router.use("/verifyOTP", checkHospitalAuth);
router.use("/patientEmergencyInfo", checkHospitalAuth);

// Public routes
router.post("/register", hospitalController.hospitalRegistration);
router.post("/login", hospitalController.hospitalLogin);
router.post(
  "/sentResetPasswordEmail",
  hospitalController.sendHospitalPasswordResetEmail
);
router.patch(
  "/resetPassword/:id/:token",
  hospitalController.hospitalPasswordReset
);

// protected routes
router.delete("/delete", hospitalController.deleteHospital);
router.patch("/changePassword", hospitalController.changeHospitalPassword);
router.get("/loggedHospital", hospitalController.loggedHospital);
router.post("/sendOTP", hospitalController.sendOTP);
router.post("/verifyOTP", hospitalController.verifyOTP);
router.get("/patientEmergencyInfo", hospitalController.patientEmergencyInfo);

// export
export default router;
