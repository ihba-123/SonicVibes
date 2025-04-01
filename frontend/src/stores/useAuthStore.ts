import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

interface AuthStore {
  isAdmin: boolean;
  authMethod: "manual" | "clerk" | null; // Track auth method
  checkAdminStatus: () => Promise<void>;
  reset: () => void;
  set: (state: Partial<AuthStore>) => void;
}

const ADMIN_EMAIL = "bhattaabhishek62@gmail.com";

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  authMethod: null, // Initially null until determined
  set: (state) => set(state),

  checkAdminStatus: async () => {
    try {
      const manualToken = localStorage.getItem("token");
      const clerkToken = localStorage.getItem("clerkToken");
      const signinResponse = localStorage.getItem("signinResponse");

      // Determine the auth method
      let token: string | null = null;
      let authMethod: "manual" | "clerk" | null = null;

      if (manualToken && signinResponse) {
        token = manualToken;
        authMethod = "manual";
        console.log("Using manual token for admin check:", token);
      } else if (clerkToken) {
        token = clerkToken;
        authMethod = "clerk";
        console.log("Using Clerk token for admin check:", token);
      } else {
        console.log("No valid tokens found, skipping admin check");
        set({ isAdmin: false, authMethod: null });
        return;
      }

      const response = await axiosInstance.get("/adminCheck", { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response from /admin/check:", response.data);
      const isAdmin = response.data.admin;
      console.log("Admin status from /admin/check:", isAdmin);
      set({ isAdmin, authMethod });

      // Fallback for manual auth email check (only if manual token is used)
      if (authMethod === "manual" && !isAdmin) {
        const signinData = JSON.parse(signinResponse || "{}");
        const userEmail = signinData.email || "";
        if (userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          console.log("Overriding to admin based on email:", userEmail);
          set({ isAdmin: true, authMethod: "manual" });
        }
      }
    } catch (error: any) {
      console.error("Error in checkAdminStatus:", error.response?.status, error.response?.data || error.message);

      if (error.response?.status === 401) {
        console.log("Unauthorized: Token invalid or expired");
        set({ isAdmin: false });

        if (localStorage.getItem("token")) {
          const signinResponse = JSON.parse(localStorage.getItem("signinResponse") || "{}");
          const userEmail = signinResponse.email || "";
          const isAdmin = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
          set({ isAdmin, authMethod: "manual" });
          if (!isAdmin) {
            console.log("Non-admin user with invalid manual token, clearing auth data");
            localStorage.removeItem("token");
            localStorage.removeItem("signinResponse");
          }
        } else if (localStorage.getItem("clerkToken")) {
          console.log("Clerk token invalid, clearing clerkToken");
          localStorage.removeItem("clerkToken");
          set({ authMethod: null });
        }
      } else if (error.response?.status === 404) {
        console.log("API /admin/check not found, using fallback logic");
        const signinResponse = JSON.parse(localStorage.getItem("signinResponse") || "{}");
        const userEmail = signinResponse.email || "";
        const isAdmin = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        set({ isAdmin, authMethod: isAdmin ? "manual" : null });
      } else {
        console.log("Unexpected error, setting isAdmin to false");
        set({ isAdmin: false, authMethod: null });
      }
    }
  },

  reset: () => {
    console.log("Resetting auth store");
    set({ isAdmin: false, authMethod: null });
  },
}));