import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/user.js";
import doctorRoutes from "./routes/doctor.js";
import hospitalRoutes from "./routes/hospital.js";

dotenv.config();
const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DATABASE_URL;
const app = express();

app.use(cors());
app.use(express.json());

connectDB(DB_URL);

// LOAD user routes
app.use("/api/user", userRoutes);

// LOAD hospital routes
app.use("/api/hospital", hospitalRoutes);

// LOAD doctor routes
app.use("/api/doctor", doctorRoutes);
app.listen(PORT, () => {
  console.log(`listen on PORT: ${PORT}`);
});
