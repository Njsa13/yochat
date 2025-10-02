const errorHandler = (error, req, res, next) => {
  res.status(error.status || 500).json({
    message: (error.status && error.message) || "Internal Server Error",
  });
};

export default errorHandler;
