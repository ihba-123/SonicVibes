import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus, set: setAuthStore } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (userId && user) {
          const clerkEmail = user.primaryEmailAddress?.emailAddress || "";
          const isAdmin = clerkEmail.toLowerCase() === "bhattaabhishek62@gmail.com";
          setAuthStore({ isAdmin, authMethod: "clerk" });
          initSocket(userId);
        } else {
          setAuthStore({ isAdmin: false, authMethod: null });
        }
      } catch (error: any) {
        console.error("Error in auth provider:", error);
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