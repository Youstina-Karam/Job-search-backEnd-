import { AppError } from "../utils/appErrors.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    let { error } = schema.validate(req.body, { abortEarly: false });
    if (!error) {
      next();
    } else {
      let errMsg = error.details.map(err => err.message)
     return next(new AppError(errMsg))
    }
  };
};
