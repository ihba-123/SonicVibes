import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
  email: string;
  id: string;
  name: string;
  exp: number;
  iat?: number;
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  console.log("Token in ProtectedRoute:", token); // Debug log

  if (!token) {
    console.log("No token found, redirecting to /signin");
    return <Navigate to="/signin" replace />;
  }

  try {
    const decoded: JwtPayload = jwtDecode(token);
    console.log("Decoded token:", decoded); // Debug log
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.log("Token expired, redirecting to /signin");
      localStorage.removeItem("token");
      return <Navigate to="/signin" replace />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;