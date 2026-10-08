module.exports = (err, req, res, next) => {
  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    message: err.message || "Internal Server Error"
  });
};
