import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    statusCode: error.statusCode,
    data: null,
    message: error.message,
    success: false,
    errors: error.errors,
  };

  return res.status(error.statusCode || 500).json(response);
};

export { errorHandler };
