import express from "express";
import doctorController from "../controllers/doctor.js";
import checkDoctorAuth from "../middlewares/doctor-auth.js";

const router = express.Router();

// route level middleware
router.use("/delete", checkDoctorAuth);
router.use("/changePassword", checkDoctorAuth);
router.use("/loggedDoctor", checkDoctorAuth);

// Public routes
router.post("/register", doctorController.doctorRegistration);
router.post("/login", doctorController.doctorLogin);
router.post(
  "/sentResetPasswordEmail",
  doctorController.sendDoctorPasswordResetEmail
);
router.patch("/resetPassword/:id/:token", doctorController.doctorPasswordReset);

// protected routes
router.delete("/delete", doctorController.deleteDoctor);
router.patch("/changePassword", doctorController.changeDoctorPassword);
router.get("/loggedDoctor", doctorController.loggedDoctor);

// export
export default router;
