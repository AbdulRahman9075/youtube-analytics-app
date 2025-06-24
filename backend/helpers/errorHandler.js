export const sendError = (res, status = 500, message = "Internal Server Error", code = "INTERNAL_ERROR") => {
  return res.status(status).json({
    success: false,
    error: {
      message,
      code
    }
  });
};
