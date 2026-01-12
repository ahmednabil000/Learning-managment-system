import { create } from "zustand";
import getTokenData from "../utils/getTokenData";

const useAuthStore = create((set) => ({
  token:
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken") ||
    null,
  isAuthenticated: !!(
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  ),
  user: getTokenData(),

  setToken: (token, remember = true) => {
    if (remember) {
      localStorage.setItem("authToken", token);
      sessionStorage.removeItem("authToken");
    } else {
      sessionStorage.setItem("authToken", token);
      localStorage.removeItem("authToken");
    }
    set({
      token,
      isAuthenticated: true,
      user: getTokenData(),
    });
  },

  clearToken: () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    set({
      token: null,
      isAuthenticated: false,
      user: null,
    });
  },
}));

export default useAuthStore;
