const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.status(401).json({ message: "Access denied. No token provided." });

  const token = authHeader.split(" ")[1]; // Extract the token after 'Bearer'

  if (!token) return res.status(401).json({ message: "Invalid token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store decoded user info in request
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};
