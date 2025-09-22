import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

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
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  );

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

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
