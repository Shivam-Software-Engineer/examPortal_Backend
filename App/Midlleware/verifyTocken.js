// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) return res.status(401).json({ message: "Token missing" });

//   const token = authHeader.split(" ")[1]; // "Bearer <token>"
//   if (!token) return res.status(401).json({ message: "Token missing" });

//   try {
//     const decoded = jwt.verify(token, "your_secret_key"); // same as login secret
//     req.user = decoded; // user info frontend se available
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// module.exports = verifyToken;
