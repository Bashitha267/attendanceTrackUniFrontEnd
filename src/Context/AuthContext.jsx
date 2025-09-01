import { createContext, useContext, useEffect, useState } from "react";

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
    loading: false,
  });

  const login = async (email, password, role) => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: "1",
        email,
        name: "John Doe",
        role: role,
        avatar: "/api/placeholder/100/100",
        createdAt: new Date().toISOString(),
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
      });

      localStorage.setItem("user", JSON.stringify(mockUser));
    }, 1000);
  };

  const register = async (userData) => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        avatar: "/api/placeholder/100/100",
        createdAt: new Date().toISOString(),
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
      });

      localStorage.setItem("user", JSON.stringify(mockUser));
    }, 1000);
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        loading: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
