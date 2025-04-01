import { LayoutDashboardIcon, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";


const Topbar = () => {
  const { isAdmin, checkAdminStatus, reset } = useAuthStore();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isEmailPasswordLoggedIn = !!localStorage.getItem("token") && !isSignedIn;
  const isGoogleLoggedIn = isSignedIn;
  const username = (localStorage.getItem("username") || "User").toString();

  useEffect(() => {
    const verifyAdmin = async () => {
      if (isEmailPasswordLoggedIn) {
        setIsCheckingAdmin(true);
        try {
          await checkAdminStatus();
        } catch (error) {
          console.error("Failed to verify admin status:", error);
        } finally {
          setIsCheckingAdmin(false);
        }
      }
    };
    verifyAdmin();
  }, [isEmailPasswordLoggedIn, checkAdminStatus]);

  useEffect(() => {
    if (!isSignedIn && !isEmailPasswordLoggedIn && isAdmin) {
      reset();
    }
  }, [isSignedIn, isEmailPasswordLoggedIn, isAdmin, reset]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("signinResponse");
      reset();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-gray-800 backdrop-blur-md z-10">
      <div className="flex gap-2 items-center">
        <img src="/Sonic.png" className="size-8" alt="SonicVibes logo" />
        ̽SONIC || VIBES
      </div>
      <div className="flex items-center gap-4 relative">
        {isCheckingAdmin ? (
          <Loader2 className="size-4 animate-spin text-white" />
        ) : isAdmin ? (
          <Link
            to="/admin"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "bg-gray-950 hover:bg-gray-800 text-white border-none"
            )}
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        ) : null}
        {isGoogleLoggedIn ? (
          <UserButton />
        ) : isEmailPasswordLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold"
            >
              {username.charAt(0).toUpperCase()}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-gray-950 rounded-lg shadow-4xl py-2">
                <p className="px-4 py-2 text-white font-semibold">Username : {username}</p>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={cn(
                    "w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700",
                    isLoggingOut && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/signin"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "bg-gray-500 hover:bg-gray-600 text-white border-none"
              )}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-black hover:bg-gray-800 text-white"
              )}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Topbar;
