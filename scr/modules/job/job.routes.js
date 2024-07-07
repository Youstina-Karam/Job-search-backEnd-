import { Router } from "express";
import { addApplication, addJob, deleteJob, getAllJobs, getSpecificJobs, jobsFilter, updateJob } from "./job.controller.js";
import { validate } from "../../middleware/validate.js";
import { jobValidate } from "./job.validation.js";
import { authorizeRole, verifyToken } from "../../middleware/verifyToken.js";
import  upload  from "../../config/multerConfig.js";

const jobRouter=Router();

jobRouter.post('',verifyToken,authorizeRole(['Company_HR']),validate(jobValidate.addJobSchema),addJob)
jobRouter.put('/:jobId',verifyToken,authorizeRole(['Company_HR']),validate(jobValidate.updateJobSchema),updateJob)
jobRouter.delete('/:jobId',verifyToken,authorizeRole(['Company_HR']),deleteJob)
jobRouter.get('',verifyToken,authorizeRole(['Company_HR','User']),getAllJobs)
jobRouter.get('',verifyToken,authorizeRole(['Company_HR','User']),getSpecificJobs)
jobRouter.get('/search',verifyToken,authorizeRole(['Company_HR','User']),jobsFilter)
jobRouter.post('/apply',verifyToken,authorizeRole(['User']) ,upload.single('userResume'),addApplication)


export default jobRouter;