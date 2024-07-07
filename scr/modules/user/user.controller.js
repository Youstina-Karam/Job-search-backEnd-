import { User } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../email/email.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appErrors.js";

// sign up
export const signup = catchError(async (req, res) => {
  // Create username
  let username = `${req.body.firstName} ${req.body.lastName}`;
  let userData = { ...req.body, username };
  await User.insertMany(userData);
  //sendEmail(req.body.email)
  res.status(201).json({ message: "'User registered successfully" });
});

// sign in
export const signin = catchError(async (req, res, next) => {
  // Find user by email or mobile number
  let user = await User.findOne({
    $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
  });
  // Check user and password
  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return next(new AppError("Invalid login credentials", 401));
  }
  // generate token
  jwt.sign({ _id: user._id.toString() }, "User-/-Token", async (err, token) => {
    // Update user status to online
    await User.findOneAndUpdate(
      { email: req.body.email },
      { status: "online" }
    );

    res.status(200).json({ message: "Login success", token: token });
  });
});

//update user
export const updateUser = catchError(async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "email",
    "mobileNumber",
    "recoveryEmail",
    "DOB",
    "firstName",
    "lastName",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return next(new AppError("Invalid updates", 400));
  }

  let user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({ user });
});

// delete user
export const deleteUser = catchError(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "User account deleted successfully" });
});

//Get user account data
export const getUser = catchError(async (req, res) => {
  req.user.password = undefined;
  res.status(200).json({ message: "success", user: req.user });
});

// Get profile data for another user
export const getAnotherUser = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({ message: "success", user: req.user });
});

// Update password
export const updatePassword = catchError(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, req.user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect current password" });
  }
  req.body.password = bcrypt.hashSync(newPassword, 8);
  await User.findByIdAndUpdate(req.user._id, { password: req.body.password });
  res.status(200).json({ message: "Password updated successfully" });
});

// Forget password
export const forgetPassword = catchError(async (req, res) => {
  req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 8);
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    { password: req.body.newPassword }
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ message: "Password reset successfully" });
});

// Get all accounts associated with a specific recovery email
export const getAllRecoveryEmail = catchError(async (req, res) => {
  const users = await User.find({ recoveryEmail: req.params.recoveryEmail });
  res.status(200).json(users);
});
