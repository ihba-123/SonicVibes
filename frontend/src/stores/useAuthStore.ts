import { create } from "zustand";

interface AuthStore {
  isAdmin: boolean;
  authMethod: "clerk" | null;
  checkAdminStatus: () => Promise<void>;
  reset: () => void;
  set: (state: Partial<AuthStore>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  authMethod: null,
  set: (state) => set(state),

  checkAdminStatus: async () => {
    try {
      const clerkToken = localStorage.getItem("clerkToken");
      if (!clerkToken) {
        set({ isAdmin: false, authMethod: null });
        return;
      }
      set({ authMethod: "clerk" });
      // Admin status will be checked via middleware
    } catch (error: any) {
      console.error("Error in checkAdminStatus:", error.message);
      set({ isAdmin: false, authMethod: null });
    }
  },

  reset: () => {
    console.log("Resetting auth store");
    set({ isAdmin: false, authMethod: null });
  },
}));