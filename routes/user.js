import express from "express";
import userController from "../controllers/user.js";
import checkUserAuth from "../middlewares/user-auth.js";

const router = express.Router();

// route level middleware
router.use("/delete", checkUserAuth);
router.use("/changePassword", checkUserAuth);
router.use("/loggedUser", checkUserAuth);

// Public routes
router.post("/register", userController.userRegistration);
router.post("/login", userController.userLogin);
router.post(
  "/sentResetPasswordEmail",
  userController.sendUserPasswordResetEmail
);
router.patch("/resetPassword/:id/:token", userController.userPasswordReset);

// protected routes
router.delete("/delete", userController.deleteUser);
router.patch("/changePassword", userController.changeUserPassword);
router.get("/loggedUser", userController.loggedUser);
router.get("/fetchByAadharId", userController.fetchByAadharId);

// export
export default router;
