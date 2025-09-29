const errorHandler = (error, req, res, next) => {
  const statusCode = error.status || 500;
  res
    .status(statusCode)
    .json({ message: error.message || "Internal Server Error" });
};

export default errorHandler;
