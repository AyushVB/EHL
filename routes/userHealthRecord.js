import express from "express";
import userHealthRecordController from "../controllers/userHealthRecord.js";
import checkUserHealthRecordAuth from "../middlewares/userHealthRecord-auth.js";
import checkHospitalAuth from "../middlewares/hospital-auth.js";

const router = express.Router();

// route level middleware
router.use("/add", checkHospitalAuth);
router.use("/update", checkHospitalAuth);
router.use("/delete", checkHospitalAuth);
router.use("/get", checkUserHealthRecordAuth);
router.use("/filter", checkUserHealthRecordAuth);

// protected routes
router.post("/add", userHealthRecordController.addUHR);
router.patch("/update", userHealthRecordController.updateUHR);
router.delete("/delete", userHealthRecordController.deleteUHR);
router.get("/get", userHealthRecordController.getUHR);
router.get("/filter", userHealthRecordController.filterUHR);

// export
export default router;
