const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  const error = new Error("Unauthorized: Please login first");
  error.status = 401;
  next(error);
};

export default isAuthenticated;
