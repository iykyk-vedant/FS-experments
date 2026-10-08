const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    req.user = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied. You do not have permission." });
  }
  next();
};

module.exports = { protect, authorize };
