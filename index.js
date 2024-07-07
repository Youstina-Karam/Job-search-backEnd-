process.on("uncaughtException", (err) => {
  console.log("error:", err);
});
import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import cors from "cors";
import userRouter from "./scr/modules/user/user.routes.js";
import jwt from "jsonwebtoken";
import { User } from "./database/models/user.model.js";
import { AppError } from "./scr/utils/appErrors.js";
import globalError from "./scr/middleware/globalError.js";
import companyRouter from "./scr/modules/company/company.routes.js";
import jobRouter from "./scr/modules/job/job.routes.js";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.use("", userRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);

app.get("/verify/:token", (req, res) => {
  jwt.verify(req.params.token, "SecretEmail", async (err, decode) => {
    if (err) return res.json(err);
    await User.findOneAndUpdate({ email: decode }, { confirmEmail: true });
    res.json({ message: "email confirmed" });
  });
});

app.use("*", (req, res, next) => {
  next(new AppError(`Route not found ${req.originalUrl}`, 404));
});

// Global error handling middleware
app.use(globalError);

process.on("unhandledRejection", (err) => {
  console.log("error:", err);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
