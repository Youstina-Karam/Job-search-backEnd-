import nodemailer from "nodemailer";
import { emailHtml } from "./emailHtml.js";
import jwt from 'jsonwebtoken'
export const sendEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "youstina.karam999@gmail.com",
      pass: "cnzixjysmmssidnc",
    },
  });

  jwt.sign(email,'SecretEmail',async (err,token)=>{
    const info = await transporter.sendMail({
        from: '"Youstina Karam 👻" <youstina.karam999@gmail.com>', // sender address
        to: email,
        subject: "Hello new2 ✔", 
        html: emailHtml(token),
      });

  console.log("message send :", info.messageId );
  })
};
