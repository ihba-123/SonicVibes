import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import SignInOAuthButtons from "@/components/SignInOAuthButtons";
import { SignedOut } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { checkAdminStatus } = useAuthStore();

  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.email) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(form.email)) return toast.error("Please enter a valid email");
    if (!form.password) return toast.error("Password is required");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    // Removed special character validation to match backend mock user password
    // if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(form.password))
    //   return toast.error("Password must contain at least one special character");

    try {
      const response = await axiosInstance.post("/signin", {
        email: form.email,
        password: form.password,
      });

      const { token, username, email } = response.data;
      console.log("Sign-in response:", { token, username, email });
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("signinResponse", JSON.stringify({ email }));
      toast.success("Sign-in successful!");
      setForm({ email: "", password: "" });

      await checkAdminStatus(); // Ensure this runs before navigation
      navigate("/", { replace: true });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Sign-in failed, please try again";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        <form className="space-y-6" onSubmit={handleForm}>
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
            Sign In
          </button>
        </form>
        <div className="mt-4">
          <SignedOut>
            <SignInOAuthButtons />
          </SignedOut>
        </div>
        <p className="text-gray-400 text-center mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-gray-300 hover:text-white underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;