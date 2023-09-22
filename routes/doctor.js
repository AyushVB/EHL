import express from "express";
import doctorController from "../controllers/doctor.js";
import checkDoctorAuth from "../middlewares/doctor-auth.js";

const router = express.Router();

// route level middleware
router.use("/changepassword", checkDoctorAuth);
router.use("/loggeddoctor", checkDoctorAuth);

// Public routes
router.post("/register", doctorController.doctorRegistration);
router.post("/login", doctorController.doctorLogin);
router.post(
  "/sent-reset-password-email",
  doctorController.sendDoctorPasswordResetEmail
);
router.put("/reset-password/:id/:token", doctorController.doctorPasswordReset);

// protected routes
router.put("/changepassword", doctorController.changeDoctorPassword);
router.get("/loggeddoctor", doctorController.loggedDoctor);

// export
export default router;
