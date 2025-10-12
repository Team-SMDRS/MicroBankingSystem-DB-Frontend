import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { isTokenExpired } from "../utils/authUtils"; // Adjust path as needed

interface AuthContextType {
  user: any;
  token: string | null;
  login: (userData: any, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken && isTokenExpired(savedToken)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      return null;
    }
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem("accessToken");
    return savedToken && !isTokenExpired(savedToken) ? savedToken : null;
  });

  const login = (userData: any, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  // (Optional) keep React state in sync with localStorage
  useEffect(() => {
    if (token) localStorage.setItem("accessToken", token);
    else localStorage.removeItem("accessToken");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Periodic check for token expiration (every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        logout();
      }
    }, 60000); // Adjust interval as needed (e.g., 60000 ms = 1 minute)

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
