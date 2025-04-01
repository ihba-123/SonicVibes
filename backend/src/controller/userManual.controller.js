import jwt from "jsonwebtoken";
import { ManualUser } from "../models/manualUser.model.js";
import mongoose from "mongoose";
const JWT_SECRET = process.env.JWT_SECRET || "347523654726345";

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Sign-in attempt - Email:", email, "Password:", password);

    if (!email || !password) {
      console.log("Sign-in failed: Email or password missing");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await ManualUser.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      console.log("Sign-in failed: User not found -", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Debug: Check if user is a Mongoose document and has comparePassword
    console.log("User found:", {
      email: user.email,
      isMongooseDocument: user instanceof mongoose.Document,
      hasComparePassword: typeof user.comparePassword === "function",
    });

    if (typeof user.comparePassword !== "function") {
      throw new Error("comparePassword method is not defined on user object");
    }

    // Compare the password as-is (without trimming, to match how it was saved)
    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      console.log("Sign-in failed: Invalid password for email -", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Generated JWT:", token);

    return res.status(200).json({
      message: "Sign-in successful",
      token,
      userId: user._id,
      username: user.name,
    });
  } catch (error) {
    console.error("Error in signIn:", error.message);
    console.error("Full error details:", error);
    return res
      .status(500)
      .json({ message: "Server error during sign-in", error: error.message });
  }
};

export const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log(
      "Sign-up attempt - Email:",
      email,
      "Name:",
      name,
      "Password:",
      password
    );

    if (!email || !password || !name) {
      console.log("Sign-up failed: Email, password, and name are required");
      return res
        .status(400)
        .json({ message: "Email, password, and name are required" });
    }

    // Validate password length before creating the user
    if (password.length < 6) {
      console.log("Sign-up failed: Password too short -", password);
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await ManualUser.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      console.log("Sign-up failed: Email already exists -", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new ManualUser({
      name: name.trim(),
      email: email.trim(),
      password: password, // Save password as-is (trimming happens in the schema)
      isAdmin: email === "bhattaabhishek62@gmail.com",
    });

    console.log("Attempting to save user to database:", {
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });

    await newUser.save();

    console.log("User successfully saved to database:", {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      isAdmin: newUser.isAdmin,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("Generated JWT:", token);

    return res.status(201).json({
      message: "Sign-up successful",
      token,
      userId: newUser._id,
      username: newUser.name,
    });
  } catch (error) {
    if (error.code === 11000) {
      console.log("Sign-up failed: Duplicate email -", email);
      return res.status(400).json({ message: "Email already exists" });
    }
    console.error("Error in signUp:", error.message);
    console.error("Full error details:", error);
    return res
      .status(500)
      .json({ message: "Server error during sign-up", error: error.message });
  }
};

export const adminCheck = async (req, res) => {
  try {
    return res.status(200).json({ admin: true });
  } catch (error) {
    console.error("Admin check error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - you must be logged in" });
  }
};
