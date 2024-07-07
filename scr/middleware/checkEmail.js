import { User } from "../../database/models/user.model.js";
import bcrypt from "bcrypt";
import { AppError } from "../utils/appErrors.js";

export const checkEmail = async (req, res, next) => {
  // Check for unique email and mobile number
  const emailExists = await User.findOne({ email: req.body.email });
  const mobileNumberExists = await User.findOne({
    mobileNumber: req.body.mobileNumber,
  });

  if (emailExists) {
    return next(new AppError("Email already exists", 400));
  }
  if (mobileNumberExists) {
    return next(new AppError("Mobile number already exists", 400));
  }
  // Hash password
  if (req.body.password)
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  next();
};
