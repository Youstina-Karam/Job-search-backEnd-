import { Application } from "../../../database/models/application.model.js";
import { Company } from "../../../database/models/company.model.js";
import { Job } from "../../../database/models/job.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appErrors.js";
import ExcelJS from "exceljs";

// add company
export const addCompany = catchError(async (req, res, next) => {
  if (req.body.companyHR !== req.user._id.toString()) {
    return next(new AppError("Access denied", 403));
  }
  // Check for unique companyName and companyEmail
  const companyEmailExists = await Company.findOne({
    companyEmail: req.body.companyEmail,
  });
  const companyNameExists = await Company.findOne({
    companyName: req.body.companyName,
  });

  if (companyEmailExists) {
    return next(new AppError("Company Email already exists", 400));
  }
  if (companyNameExists) {
    return next(new AppError("Company Name already exists", 400));
  }
  await Company.insertMany(req.body);
  res.status(201).json({ message: "Company added successfully" });
});

// //update company
export const updateCompany = catchError(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);
  if (!company || company.companyHR.toString() !== req.user.id) {
    return next(new AppError("'Access denied'", 403));
  }
  await Company.findByIdAndUpdate(req.params.companyId, req.body);
  res.status(200).json({ message: "Company updated successfully" });
});

// //delete company
export const deleteCompany = catchError(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId);

  if (!company || company.companyHR.toString() !== req.user.id) {
    return next(new AppError("Access denied", 403));
  }

  await Company.findByIdAndDelete(req.params.companyId);
  res.status(200).json({ message: "Company deleted successfully" });
});

// //get  company
export const getCompany = catchError(async (req, res, next) => {
  const company = await Company.findById(req.params.companyId).populate(
    "companyHR"
  );
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  let jobs = await Job.find({ company: company._id });

  res.status(200).json({ company, jobs: jobs });
});

// // Search for a company with a name
export const SearchCompany = catchError(async (req, res) => {
  const companies = await Company.find({
    companyName: new RegExp(req.params.name, "i"),
  });
  res.status(200).json(companies);
});

// Get all applications for specific Jobs
export const getApplicationJobs = catchError(async (req, res, next) => {
  const { date } = req.query;
  if (!date) {
    return next(new AppError("Date query parameter is required", 400));
  }
  const company = await Company.findById(req.params.companyId);

  if (!company || company.companyHR.toString() !== req.user.id) {
    return next(new AppError("Access denied", 403));
  }

  // Convert date string to Date object and get the start and end of the day
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setHours(23, 59, 59, 999);

  let jobs = await Job.find({ company: company._id });
  const applications = await Application.find({
    createdAt: { $gte: startDate, $lte: endDate },
    jobId: { $in: jobs.map((job) => job._id) },
  }).populate("userId");

  if (applications.length === 0) {
    return next(
      new AppError("No applications found for the specified date", 404)
    );
  }

  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Applications");

  // Define columns
  worksheet.columns = [
    { header: "Job Title", key: "jobTitle", width: 30 },
    { header: "Applicant Name", key: "applicantName", width: 30 },
    { header: "Technical Skills", key: "technicalSkills", width: 30 },
    { header: "Soft Skills", key: "softSkills", width: 30 },
    { header: "Resume URL", key: "resumeUrl", width: 30 },
    { header: "Application Date", key: "applicationDate", width: 20 },
  ];
  
    // Add rows to the worksheet
    applications.forEach(app => {
      worksheet.addRow({
        jobTitle: app.jobId?.jobTitle || 'N/A',
        applicantName: `${app.userId?.firstName || 'N/A'} ${app.userId?.lastName || 'N/A'}`,
        technicalSkills: app.userTechSkills.join(', ') || 'N/A',
        softSkills: app.userSoftSkills.join(', ') || 'N/A',
        resumeUrl: app.userResume || 'N/A',
        applicationDate: app.createdAt ? app.createdAt.toISOString().split('T')[0] : 'N/A'
      });
    });

  // Set the response headers for downloading the file
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=applications.xlsx"
  );

  // Write to the response stream
  await workbook.xlsx.write(res);

  res.status(200).json(applications);
});
