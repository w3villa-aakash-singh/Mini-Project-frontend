import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, logoutUser } from "@/features/auth/services/AuthService";
import apiClient from "@/config/axiosClient";
import { toast } from "react-hot-toast";

const LOCAL_KEY = "app_state";

const useAuth = create(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      authStatus: false,
      authLoading: false,

      // =========================
      // LOGIN
      // =========================
      login: async (loginData) => {
        set({ authLoading: true });

        try {
          const res = await loginUser(loginData);

          set({
            accessToken: res.accessToken,
            user: res.user,
            authStatus: true,
          });

          toast.success("Welcome back!");
          return res;

        } catch (error) {
          toast.error("Login failed");
          throw error;

        } finally {
          set({ authLoading: false });
        }
      },

      // =========================
      // 🔥 SET ACCESS TOKEN (used by interceptor)
      // =========================
      setAccessToken: (token) => {
        set({ accessToken: token });
      },

      // =========================
      // 🔥 REFRESH USER
      // =========================
      refreshUser: async () => {
  try {
    const res = await apiClient.get("/auth/me");

    set({
      user: res.data.user, // ✅ FIX
      authStatus: true,
    });

    console.log("✅ User refreshed:", res.data);

    if (res.data.expired) {
      toast.error("Your plan has expired");
    }

    return res.data; // optional but useful

  } catch (error) {
    console.error("❌ Refresh user failed:", error);
  }
},

      // =========================
      // LOGOUT
      // =========================
      logout: async () => {
        set({ authLoading: true });

        try {
          await logoutUser();
        } catch (e) {
          console.error(e);
        } finally {
          set({
            accessToken: null,
            user: null,
            authStatus: false,
            authLoading: false,
          });

          localStorage.removeItem(LOCAL_KEY);
        }
      },

      // =========================
      // CHECK LOGIN
      // =========================
      checkLogin: () => {
        const state = get();
        return !!(state.accessToken && state.authStatus);
      },
    }),
    { name: LOCAL_KEY }
  )
);

export default useAuth;