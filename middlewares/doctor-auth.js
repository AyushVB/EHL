import jwt from "jsonwebtoken";
import doctorModel from "../models/doctors.js";

const checkUserAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!(authorization && authorization.startsWith("Bearer"))) {
    res.status(401).send({ status: "failed", message: "Unauthorized doctor" });
  } else {
    const token = await authorization.split(" ")[1];

    // verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, doctor) => {
      if (err) {
        return res
          .status(403)
          .send({ status: "failed", message: "Authentication refused" });
      }
      if (!(doctor.type === "doctor")) {
        return res
          .status(403)
          .send({ status: "failed", message: "Authentication refused" });
      }
      req.doctor = await doctorModel
        .findById(doctor.doctorId)
        .select("-password");
      if (!req.doctor) {
        return res
          .status(403)
          .send({ status: "failed", message: "Unauthorized doctor " });
      }
      next();
    });
  }
};

export default checkUserAuth;
