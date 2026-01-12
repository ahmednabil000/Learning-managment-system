export default function getTokenData() {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
}
