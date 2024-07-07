import Joi from "joi";

export const jobValidate = {
  addJobSchema: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime: Joi.string().valid("part-time", "full-time").required(),
    seniorityLevel: Joi.string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .required(),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().items(Joi.string()).required(),
    softSkills: Joi.array().items(Joi.string()).required(),
    company: Joi.string().required(),
  }),
  updateJobSchema: Joi.object({
    jobTitle: Joi.string(),
    jobLocation: Joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: Joi.string().valid("part-time", "full-time"),
    seniorityLevel: Joi.string().valid(
      "Junior",
      "Mid-Level",
      "Senior",
      "Team-Lead",
      "CTO"
    ),
    jobDescription: Joi.string(),
    technicalSkills: Joi.array().items(Joi.string()),
    softSkills: Joi.array().items(Joi.string()),
  }),
  applyJobSchema: Joi.object({
    jobId: Joi.string().required(),
    userTechSkills: Joi.array().items(Joi.string()).required(),
    userSoftSkills: Joi.array().items(Joi.string()).required(),
    userResume: Joi.string().required(),
  }),
};
