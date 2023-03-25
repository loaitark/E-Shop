const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 400;
  err.status = err.status || "err";

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-use-before-define
    sendErrorForDev(err, res);
  } else {
    // eslint-disable-next-line no-use-before-define
    sendErrorForProd(err, res);
  }
};
// eslint-disable-next-line no-undef
const sendErrorForDev = (err, res) =>
  // eslint-disable-next-line no-undef
  res.status(err.statusCode).json({
    // eslint-disable-next-line no-undef
    status: err.status,
    // eslint-disable-next-line no-undef
    error: err,
    // eslint-disable-next-line no-undef
    message: err.message,
    // eslint-disable-next-line no-undef
    stack: err.stack,
  });
// eslint-disable-next-line no-undef
const sendErrorForProd = (err, res) =>
  // eslint-disable-next-line no-undef
  res.status(err.statusCode).json({
    // eslint-disable-next-line no-undef
    status: err.status,
    // eslint-disable-next-line no-undef
    message: err.message,
  });

module.exports = globalError;
