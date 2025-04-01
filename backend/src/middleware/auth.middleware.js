import { clerkClient } from "@clerk/express";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "bhattaabhishek62@gmail.com";

export const protectRoute = async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ message: "Unauthorized - you must be logged in" });
    }
    req.authType = "clerk";
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error.message);
    return res.status(401).json({ message: "Unauthorized - authentication failed" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (req.authType !== "clerk") {
      return res.status(401).json({ message: "Unauthorized - Clerk authentication required" });
    }
    
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const userEmail = currentUser.primaryEmailAddress?.emailAddress;
    const isAdmin = ADMIN_EMAIL === userEmail;

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized - you must be an admin" });
    }
    req.userEmail = userEmail;
    next();
  } catch (error) {
    console.error("Error in requireAdmin:", error.message);
    return res.status(500).json({ message: "Server error during admin check" });
  }
};