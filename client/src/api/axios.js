import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  // The free Render server "sleeps" and can take ~30s to wake up, so be patient before giving up
  timeout: 45000,
});

// Attach the login token to every request, if there is one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Pages where being logged out is normal, so we must not redirect from them
const PUBLIC_PATHS = ["/login", "/register"];

// Look at every response before the page code sees it.
// If the server says the token is missing/expired (401 + code "AUTH_REQUIRED"),
// forget the token and send the user to the login page with a friendly message.
// (Other 401s, like "wrong password" on the login form, are left for the page to show.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response?.status === 401 && response.data?.code === "AUTH_REQUIRED") {
      localStorage.removeItem("token");
      if (!PUBLIC_PATHS.includes(window.location.pathname)) {
        window.location.assign("/login?expired=1"); // full reload also clears the logged-in user from memory
      }
    }
    return Promise.reject(error); // the page's own .catch() still runs
  }
);

export default api;
