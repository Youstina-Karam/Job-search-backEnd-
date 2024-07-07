import { Router } from "express";
import { authorizeRole, verifyToken } from "../../middleware/verifyToken.js";
import { validate } from "../../middleware/validate.js";
import { companyValidate } from "./company.validation.js";
import { addCompany, deleteCompany, getApplicationJobs, getCompany, SearchCompany, updateCompany } from "./company.controller.js";


const companyRouter =Router()

companyRouter.post('',verifyToken,authorizeRole(['Company_HR']),validate(companyValidate.addCompany),addCompany)
companyRouter.put('/:companyId',verifyToken,authorizeRole(['Company_HR']),validate(companyValidate.updateCompany),updateCompany)
companyRouter.delete('/:companyId',verifyToken,authorizeRole(['Company_HR']),deleteCompany)
companyRouter.get('/:companyId',verifyToken,authorizeRole(['Company_HR']),getCompany)
companyRouter.get('/search/:name',verifyToken,authorizeRole(['Company_HR', 'User']),SearchCompany)
companyRouter.get('/:companyId/applications',verifyToken,authorizeRole(['Company_HR']),getApplicationJobs)


export default companyRouter;