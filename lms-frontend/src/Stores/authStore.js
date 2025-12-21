import { create } from "zustand";
import getTokenData from "../utils/getTokenData";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  user: getTokenData(),

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({
      token,
      isAuthenticated: true,
      user: getTokenData(),
    });
  },

  clearToken: () => {
    localStorage.removeItem("token");
    set({
      token: null,
      isAuthenticated: false,
      user: null,
    });
  },
}));

export default useAuthStore;
