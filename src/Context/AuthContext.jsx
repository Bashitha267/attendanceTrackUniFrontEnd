import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// const navigate = useNavigate();
const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null, // Manages login error messages
  });

  const login = async (email, password) => {
    // Clear previous errors and set loading state
    setAuthState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));


    try {
      const response = await fetch('https://attendance-uni-backend.vercel.app/users/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Required for sending/receiving cookies cross-origin
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      const decodedToken = jwtDecode(data.token);

      const userPayload = {
        id: decodedToken.reg_no,
        email: decodedToken.email,
        name: decodedToken.name,
        role: decodedToken.role,
        avatar: decodedToken.image,
        reg_no:decodedToken.reg_nogi
      };

      setAuthState({
        user: userPayload,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      localStorage.setItem("user", JSON.stringify(userPayload));
      return true;
      // navigate("/");

    } catch (error) {
      console.error("Login failed:", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: error.message, // Store the error message in the state
      });
      return false;
    }
  };

  const logout = () => {
    // For a complete solution, call a backend endpoint here to clear the httpOnly cookie.
    // const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    // fetch(`${apiUrl}/users/logout`, { method: 'POST', credentials: 'include' });

    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
    localStorage.removeItem("user");
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setAuthState({
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};