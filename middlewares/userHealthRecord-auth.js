import jwt from "jsonwebtoken";
import userHealthRecordModel from "../models/userHealthRecords.js";

const checkUserHealthRecordAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!(authorization && authorization.startsWith("Bearer"))) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized userHealthRecord" });
  } else {
    const token = await authorization.split(" ")[1];

    // verify token
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      async (err, userHealthRecord) => {
        if (err) {
          return res
            .status(403)
            .send({ status: "failed", message: "Authentication refused" });
        }

        req.userHealthRecord = userHealthRecord;
        if (!req.userHealthRecord) {
          return res.status(403).send({
            status: "failed",
            message: "Unauthorized userHealthRecord ",
          });
        }
        next();
      }
    );
  }
};

export default checkUserHealthRecordAuth;
