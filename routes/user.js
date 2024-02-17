import express from "express";
import userController from "../controllers/user.js";
import checkUserAuth from "../middlewares/user-auth.js";
import checkHospitalAuth from "../middlewares/hospital-auth.js";

const router = express.Router();

// route level middleware
router.use("/changePassword", checkUserAuth);
router.use("/loggedUser", checkUserAuth);
router.use("/fetchByAadharId", checkHospitalAuth);

// Public routes
router.post("/register", userController.userRegistration);
router.post("/login", userController.userLogin);
router.post(
  "/sentResetPasswordEmail",
  userController.sendUserPasswordResetEmail
);
router.put("/resetPassword/:id/:token", userController.userPasswordReset);

// protected routes
router.patch("/changepassword", userController.changeUserPassword);
router.get("/loggeduser", userController.loggedUser);
router.get("/fetchByAadharId", userController.fetchByAadharId);

// export
export default router;
