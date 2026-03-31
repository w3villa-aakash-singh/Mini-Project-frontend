import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, logoutUser } from "@/services/AuthService";
import { toast } from "react-hot-toast";

const LOCAL_KEY = "app_state";

const useAuth = create(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      authStatus: false,
      authLoading: false,

      login: async (loginData) => {
        set({ authLoading: true });
        try {
          const loginResponseData = await loginUser(loginData);

          set({
            accessToken: loginResponseData.accessToken,
            user: loginResponseData.user,
            authStatus: true,
          });

          toast.success("Access Granted. Welcome back!");
          return loginResponseData;
        } catch (error) {
          // 1. Extract Status Code
          const status = error.response?.status;

          // 2. Extract Message Safely (Prevents "Objects are not valid" crash)
          const backendData = error.response?.data;
          let message = "An unexpected error occurred";

          if (typeof backendData === 'string') {
            message = backendData;
          } else if (backendData && typeof backendData === 'object') {
            // Spring often wraps errors in a 'message' or 'error' key
            message = backendData.message || backendData.error || message;
          }

          // 3. Logic-based Toasts
          if (status === 403 || message.toLowerCase().includes("verify") || message.toLowerCase().includes("disabled")) {
            toast.error("Account not verified. Please check your email!");
          } else if (status === 401) {
            toast.error("Invalid credentials. Try again.");
          } else {
            toast.error(message);
          }

          throw error;
        } finally {
          set({ authLoading: false });
        }
      },

      logout: async () => {
        set({ authLoading: true });
        try {
          await logoutUser();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            accessToken: null,
            user: null,
            authLoading: false,
            authStatus: false,
          });
          // Note: Only clear relevant keys if other data exists in localStorage
          localStorage.removeItem(LOCAL_KEY);
        }
      },

      checkLogin: () => {
        const state = get();
        return !!(state.accessToken && state.authStatus);
      },
    }),
    { name: LOCAL_KEY }
  )
);

export default useAuth;