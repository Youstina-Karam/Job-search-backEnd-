import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryEmail: {
    type: String,
  },
  DOB: {
    type: Date,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["User", "Company_HR"],
    required: true,
  },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },

});

export const User = model("User", UserSchema);
