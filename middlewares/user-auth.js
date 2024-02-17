import jwt from "jsonwebtoken";
import userModel from "../models/users.js";

const checkUserAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!(authorization && authorization.startsWith("Bearer"))) {
    res.status(401).send({ status: "failed", message: "Unauthorized user" });
  } else {
    const token = await authorization.split(" ")[1];

    // verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err) {
        return res
          .status(403)
          .send({ status: "failed", message: "Authentication refused" });
      }
      if (!(user.type === "user")) {
        return res
          .status(403)
          .send({ status: "failed", message: "Authentication refused" });
      }
      req.user = await userModel.findById(user.userId).select("-password");
      if (!req.user) {
        return res
          .status(403)
          .send({ status: "failed", message: "Unauthorized user " });
      }
      next();
    });
  }
};

export default checkUserAuth;
