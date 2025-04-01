import { clerkClient } from "@clerk/express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "347523654726345";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "bhattaabhishek62@gmail.com";


export const protectRoute = async (req, res, next) => {
  try {
    // Check for Clerk authentication
    if (req.auth?.userId) {
      req.authType = "clerk";
      return next();
    }

    // Check for manual authentication (JWT in Authorization header)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - you must be logged in" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      console.log("No token provided in Authorization header");
      return res.status(401).json({ message: "Unauthorized - you must be logged in" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      req.authType = "manual";
      console.log("Authenticated via manual JWT, user:", decoded);
      next();
    } catch (error) {
      console.error("Manual JWT verification failed:", error.message);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized - invalid or expired token" });
      }
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }
  } catch (error) {
    console.error("Error in protectRoute:", error.message);
    return res.status(401).json({ message: "Unauthorized - authentication failed" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (req.authType === "clerk") {
      const currentUser = await clerkClient.users.getUser(req.auth.userId);
      const userEmail = currentUser.primaryEmailAddress?.emailAddress;
      const isAdmin = ADMIN_EMAIL === userEmail;

      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized - you must be an admin" });
      }
      req.userEmail = userEmail;
      next();
    } else if (req.authType === "manual") {
      const userEmail = req.user.email;
      const isAdmin = ADMIN_EMAIL.toLowerCase() === userEmail.toLowerCase();

      console.log("Manual admin check - Email:", userEmail, "isAdmin:", isAdmin);

      if (!isAdmin) {
        return res.status(403).json({ message: "Unauthorized - you must be an admin" });
      }
      req.userEmail = userEmail;
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized - authentication type not recognized" });
    }
  } catch (error) {
    console.error("Error in requireAdmin:", error.message);
    return res.status(500).json({ message: "Server error during admin check" });
  }
};