const notFound = (req, res, next) => {
  // when user types illegal url this error message throw out
  const error = new Error(`Not Found - ${req.originalUrl}`);

  res.status(404);

  // pass the error down to next middleware
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
