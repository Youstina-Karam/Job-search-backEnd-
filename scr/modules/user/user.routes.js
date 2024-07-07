import { Router } from "express";
import { deleteUser, forgetPassword, getAllRecoveryEmail, getAnotherUser, getUser, signin, signup, updatePassword, updateUser } from "./user.controller.js";
import { checkEmail } from "../../middleware/checkEmail.js";
import { validate } from "../../middleware/validate.js";
import { userValidate } from "./user.validation.js";
import { verifyToken } from "../../middleware/verifyToken.js";


const userRouter = Router()


userRouter.post('/auth/signup',validate(userValidate.signUp),checkEmail,signup)
userRouter.post('/auth/signin',validate(userValidate.signIn),signin)
userRouter.put('/user/:id',verifyToken,validate(userValidate.updateUser),updateUser)
userRouter.delete('/user/:id',verifyToken,deleteUser)
userRouter.get('/user',verifyToken,getUser)
userRouter.get('/user/:id',verifyToken,getAnotherUser)
userRouter.put('/updatePassword',verifyToken,validate(userValidate.updatePassword),updatePassword)
userRouter.post('/forget-password',validate(userValidate.forgetPassword),forgetPassword)
userRouter.get('/recovery-email/:recoveryEmail',getAllRecoveryEmail)



export default userRouter;