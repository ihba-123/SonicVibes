import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null, isClerk: boolean = false) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (isClerk) {
      localStorage.setItem("clerkToken", token); // Store Clerk token
      console.log("Clerk token stored:", token);
    }
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("clerkToken");
    console.log("Token removed from axiosInstance and localStorage");
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {  userId } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus, set: setAuthStore } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const manualToken = localStorage.getItem("token");
        console.log("AuthProvider - Initial manualToken:", manualToken);
        console.log("AuthProvider - Initial signinResponse:", localStorage.getItem("signinResponse"));
        console.log("AuthProvider - Initial username:", localStorage.getItem("username"));
        console.log("AuthProvider - Clerk userId:", userId, "user:", user);
  
        if (manualToken && localStorage.getItem("signinResponse")) {
          console.log("Manual token found on init:", manualToken);
          updateApiToken(manualToken);
          await checkAdminStatus();
          const signinResponse = JSON.parse(localStorage.getItem("signinResponse") || "{}");
          const manualUserId = signinResponse.userId || "manual-" + Date.now();
          initSocket(manualUserId);
          console.log("Manual auth rehydrated with userId:", manualUserId);
        } else if (userId && user) {
          localStorage.removeItem("token");
          localStorage.removeItem("signinResponse");
          localStorage.removeItem("username");
          updateApiToken(null); // Clear any token since Clerk uses middleware
          const clerkEmail = user.primaryEmailAddress?.emailAddress || "";
          console.log("Clerk email retrieved:", clerkEmail);
  
          const isAdmin = clerkEmail.toLowerCase() === "bhattaabhishek62@gmail.com";
          setAuthStore({ isAdmin, authMethod: "clerk" });
          initSocket(userId);
          console.log("Clerk auth initialized with userId:", userId);
        } else {
          console.log("No auth detected");
          updateApiToken(null);
          setAuthStore({ isAdmin: false, authMethod: null });
        }
      } catch (error: any) {
        console.error("Error in auth provider:", error);
        updateApiToken(null);
        if (!userId || !user) setAuthStore({ isAdmin: false, authMethod: null });
      } finally {
        setLoading(false);
      }
    };
  
    initAuth();
  
    return () => disconnectSocket();
  }, [userId, user, checkAdminStatus, initSocket, disconnectSocket]);


  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );

  return <>{children}</>;
};

export default AuthProvider;