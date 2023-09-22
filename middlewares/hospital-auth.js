import jwt from "jsonwebtoken";
import hospitalModel from "../models/hospitals.js";

const checkUserAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!(authorization && authorization.startsWith("Bearer"))) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized hospital" });
  } else {
    const token = await authorization.split(" ")[1];

    // verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, hospital) => {
      if (err) {
        return res
          .status(403)
          .send({ status: "failed", message: "Authentication refused" });
      }
      if (!(hospital.type === "hospital")) {
        return res
          .status(403)
          .send({ status: "failed", message: "Authentication refused" });
      }
      req.hospital = await hospitalModel
        .findById(hospital.hospitalID)
        .select("-password");
      if (!req.hospital) {
        return res
          .status(403)
          .send({ status: "failed", message: "Unauthorized hospital " });
      }
      next();
    });
  }
};

export default checkUserAuth;
