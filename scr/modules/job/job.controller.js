import { Application } from "../../../database/models/application.model.js";
import { Company } from "../../../database/models/company.model.js";
import { Job } from "../../../database/models/job.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appErrors.js";

//Add job
export const addJob = catchError(async (req, res) => {
  Job.insertMany({ ...req.body, addedBy: req.user.id });
  res.status(201).json({ message: "Job added successfully" });
});

//Update job
export const updateJob = catchError(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
    new: true,
  });
  if (!job) return next(new AppError("Job not found", 404));
  res.status(200).json({ message: "Job updated successfully" });
});

//Delete job
export const deleteJob = catchError(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.jobId);
  if (!job) return next(new AppError("Job not found", 404));
  res.status(200).json({ message: "Job deleted successfully" });
});

// Get all Jobs with their company’s information
export const getAllJobs = catchError(async (req, res, next) => {
  const jobs = await Job.find().populate("company");
  if (!jobs) return next(new AppError("Job not found", 404));
  res.status(200).json(jobs);
});

// Get all Jobs for a specific company
export const getSpecificJobs = catchError(async (req, res, next) => {
  const company = await Company.findOne({ companyName: req.query.companyName });
  if (!company) return next(new AppError("Company not found", 404));
  const jobs = await Job.find({ company: company._id });
  if (!jobs) return next(new AppError("Job not found", 404));
  res.status(200).json(jobs);
});

// Get all Jobs that match the filters
export const jobsFilter = catchError(async (req, res, next) => {
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;
  const filters = {
    ...(workingTime && { workingTime }),
    ...(jobLocation && { jobLocation }),
    ...(seniorityLevel && { seniorityLevel }),
    ...(jobTitle && { jobTitle }),
    ...(technicalSkills && {
      technicalSkills: { $in: technicalSkills.split(",") },
    }),
  };
  const jobs = await Job.find(filters);
  if (!jobs) return next(new AppError("Job not found", 404));
  res.status(200).json(jobs);
});

// Apply to Job
export const addApplication = catchError(async (req, res) => {
  // Get the uploaded file URL from Cloudinary
  req.body.userResume = req.file.path;
  Application.insertMany({ ...req.body, userId: req.user.id });
  res.status(201).json({ message: "Application added successfully" });
});
