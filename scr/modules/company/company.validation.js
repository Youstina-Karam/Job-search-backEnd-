import Joi from "joi";

export const companyValidate = {
  addCompany: Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.string()
      .pattern(/^\d+-\d+$/)
      .required(),
    companyEmail: Joi.string().email().required(),
    companyHR: Joi.string().required(),
  }),
  updateCompany: Joi.object({
    companyName: Joi.string(),
    description: Joi.string(),
    industry: Joi.string(),
    address: Joi.string(),
    numberOfEmployees: Joi.string().pattern(/^\d+-\d+$/),
    companyEmail: Joi.string().email(),
  }),
};
