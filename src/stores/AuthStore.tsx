/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  userInfo: any | null;
  setAuth: (accessToken: string, refreshToken: string) => void;
  setUserInfo: (userInfo: any) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  typeof window !== "undefined"
    ? persist(
        (set) => ({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          userInfo: null,
          setAuth: (accessToken, refreshToken) => {
            set({
              accessToken,
              refreshToken,
              isAuthenticated: true,
            });
          },
          setUserInfo: (userInfo) => {
            set({ userInfo });
          },
          clearAuth: () => {
            set({
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              userInfo: null,
            });
          },
        }),
        {
          name: "auth-storage",
          storage: createJSONStorage(() => sessionStorage),
        }
      )
    : (set) => ({
        // Fallback without persistence for SSR
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        userInfo: null,
        setAuth: (accessToken, refreshToken) => {
          set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });
        },
        setUserInfo: (userInfo) => {
          set({ userInfo });
        },
        clearAuth: () => {
          set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            userInfo: null,
          });
        },
      })
);

export default useAuthStore;
