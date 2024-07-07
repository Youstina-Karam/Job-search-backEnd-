const globalError =(err,req,res,next)=>{

 // Default values for error
 err.statusCode = err.statusCode || 500;
 err.status = err.status || 'error';

 // Send error response
 res.status(err.statusCode).json({
   status: err.status,
   message: err.message,
 });
}

export default globalError;