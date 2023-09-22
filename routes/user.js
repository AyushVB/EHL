import express from "express";
import userController from "../controllers/user.js";
import checkUserAuth from "../middlewares/user-auth.js";

const router = express.Router();

// route level middleware
router.use("/changepassword", checkUserAuth);
router.use("/loggeduser", checkUserAuth);

// Public routes
router.post("/register", userController.userRegistration);
router.post("/login", userController.userLogin);
router.post(
  "/sent-reset-password-email",
  userController.sendUserPasswordResetEmail
);
router.put("/reset-password/:id/:token", userController.userPasswordReset);

// protected routes
router.patch("/changepassword", userController.changeUserPassword);
router.get("/loggeduser", userController.loggedUser);

// export
export default router;
