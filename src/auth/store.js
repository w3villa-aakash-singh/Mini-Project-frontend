import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, logoutUser } from "@/services/AuthService";

const LOCAL_KEY = "app_state";

/**
 * Main logic for global auth state
 */
const useAuth = create(
  persist(
    (set, get) => ({
      // --- Initial State ---
      accessToken: null,
      user: null,
      authStatus: false,
      authLoading: false,

      // --- Actions ---
      changeLocalLoginData: (accessToken, user, authStatus) => {
        set({
          accessToken,
          user,
          authStatus,
        });
      },

      login: async (loginData) => {
        console.log("Started login sequence...");
        set({ authLoading: true });
        try {
          const loginResponseData = await loginUser(loginData);
          console.log("Login Success:", loginResponseData);
          
          set({
            accessToken: loginResponseData.accessToken,
            user: loginResponseData.user,
            authStatus: true,
          });
          
          return loginResponseData;
        } catch (error) {
          console.error("Login Error:", error);
          throw error;
        } finally {
          set({ authLoading: false });
        }
      },

      logout: async (silent = false) => {
        set({ authLoading: true });
        try {
          // We call the service first before clearing local state
          await logoutUser();
        } catch (error) {
          console.error("Logout Service Error:", error);
        } finally {
          // Always clear local state even if the server-side logout fails
          set({
            accessToken: null,
            user: null,
            authLoading: false,
            authStatus: false,
          });
        }
      },

      checkLogin: () => {
        const state = get();
        return !!(state.accessToken && state.authStatus);
      },
    }),
    { 
      name: LOCAL_KEY 
    }
  )
);

export default useAuth;