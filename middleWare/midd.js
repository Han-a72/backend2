


// // Middleware to authenticate the user using JWT
// export const connect = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1]; // Extract token from the Authorization header
//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with your secret key
//     req.userId = decoded.userId; // Attach the user's ID to the request object
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };