import mongoose from "mongoose";
import bcrypt from "bcrypt";

const manualusers = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Validate password length before saving
manualusers.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Validate password length manually to catch errors early
  if (this.password.length < 6) {
    const error = new Error("Password must be at least 6 characters long");
    console.error("Validation error for user", this.email, ":", error.message);
    return next(error);
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const originalPassword = this.password;
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully for user:", this.email, "Original:", originalPassword, "Hashed:", this.password);
    next();
  } catch (error) {
    console.error("Error hashing password for user", this.email, ":", error.message);
    next(error);
  }
});

// Method to compare passwords
manualusers.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log("Password comparison for user", this.email, "- Provided:", candidatePassword, "Stored (hashed):", this.password, "Result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error comparing password for user", this.email, ":", error.message);
    throw error;
  }
};

// Ensure the model is only defined once
const ManualUser = mongoose.models.manualusers || mongoose.model("manualusers", manualusers);

export { ManualUser };