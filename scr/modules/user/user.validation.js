import Joi from 'joi'

export const userValidate = {
  signUp: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    recoveryEmail: Joi.string().email(),
    DOB: Joi.date().required(),
    mobileNumber: Joi.string().required(),
    role: Joi.string().valid('User', 'Company_HR').required()
  }),

  signIn: Joi.object({
    email: Joi.string().email(),
    mobileNumber: Joi.string(),
    password: Joi.string().required()
  }),

  updateUser: Joi.object({
    email: Joi.string().email(),
    mobileNumber: Joi.string(),
    recoveryEmail: Joi.string().email(),
    DOB: Joi.date(),
    firstName: Joi.string(),
    lastName: Joi.string()
  }),

  updatePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  }),

  forgetPassword: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  })
};