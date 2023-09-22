import express from "express";
import hospitalController from "../controllers/hospital.js";
import checkHospitalAuth from "../middlewares/hospital-auth.js";

const router = express.Router();

// route level middleware
router.use("/changepassword", checkHospitalAuth);
router.use("/loggedhospital", checkHospitalAuth);

// Public routes
router.post("/register", hospitalController.hospitalRegistration);
router.post("/login", hospitalController.hospitalLogin);
router.post(
  "/sent-reset-password-email",
  hospitalController.sendHospitalPasswordResetEmail
);
router.patch(
  "/reset-password/:id/:token",
  hospitalController.hospitalPasswordReset
);

// protected routes
router.patch("/changepassword", hospitalController.changeHospitalPassword);
router.get("/loggedhospital", hospitalController.loggedHospital);

// export
export default router;
