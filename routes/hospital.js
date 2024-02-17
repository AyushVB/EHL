import express from "express";
import hospitalController from "../controllers/hospital.js";
import checkHospitalAuth from "../middlewares/hospital-auth.js";

const router = express.Router();

// route level middleware
router.use("/changePassword", checkHospitalAuth);
router.use("/loggedHospital", checkHospitalAuth);
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
router.patch("/changepassword", hospitalController.changeHospitalPassword);
router.get("/loggedhospital", hospitalController.loggedHospital);
router.get("/patientEmergencyInfo", hospitalController.patientEmergencyInfo);

// export
export default router;
