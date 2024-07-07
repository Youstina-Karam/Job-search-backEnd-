import jwt from "jsonwebtoken";
import { catchError } from "./catchError.js";
import { User } from "../../database/models/user.model.js";
import { AppError } from "../utils/appErrors.js";

export const verifyToken = catchError(async (req, res, next) => {
  let { token } = req.headers;
  jwt.verify(token, "User-/-Token", async (err, decoded) => {
    if (err)  return next(new AppError(err, 401));
    const user = await User.findOne({_id:decoded._id});
    req.user = user;
    next();
  });
});

export const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("'Access denied'",403))
  }
  next();
}
