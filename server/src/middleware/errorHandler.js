export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({ message: "This email has already applied for this internship." });
  }
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((item) => item.message);
    return res.status(400).json({ message: messages.join(". ") });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid identifier." });
  }

  const status = err.status || 500;
  return res.status(status).json({
    message: status === 500 ? "An unexpected server error occurred." : err.message
  });
}
