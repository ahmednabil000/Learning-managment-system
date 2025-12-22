import { create } from "zustand";
import getTokenData from "../utils/getTokenData";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("authToken") || null,
  isAuthenticated: localStorage.getItem("authToken") ? true : false,
  user: getTokenData(),

  setToken: (token) => {
    localStorage.setItem("authToken", token);
    set({
      token,
      isAuthenticated: true,
      user: getTokenData(),
    });
  },

  clearToken: () => {
    localStorage.removeItem("authToken");
    set({
      token: null,
      isAuthenticated: false,
      user: null,
    });
  },
}));

export default useAuthStore;
