import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignInOAuthButtons from "@/components/SignInOAuthButtons";
import { SignedOut } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password } = form;

    setError("");

    if (!name) return toast.error("Name is required");
    if (name.length < 3) return toast.error("Name must be at least 3 characters");
    if (/\d/.test(name)) return toast.error("Name must not contain numbers");
    if (!email) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Please enter a valid email");
    if (!password) return toast.error("Password is required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password))
      return toast.error("Password must contain at least one special character");

    try {
      const response = await axiosInstance.post("/signup", {
        name,
        email,
        password,
      });
      console.log(response);
      toast.success("Account created successfully!");
      setForm({ name: "", email: "", password: "" });
      navigate("/signin"); 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Signup failed, please try again";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>

        <form className="space-y-6" onSubmit={handleForm}>
          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4">
          <SignedOut>
            <SignInOAuthButtons />
          </SignedOut>
        </div>

        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-gray-300 hover:text-white underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;