import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [access, setAccess] = useState(localStorage.getItem("access"));
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh"));
  const navigate = useNavigate();

  const login = ({ tokens, user }) => {
    setAccess(tokens.access);
    setRefresh(tokens.refresh);
    setUser(user);
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setAccess(null);
    setRefresh(null);
    setUser(null);
    localStorage.clear();
    navigate("/login");
  };

  const isAuthenticated = !!access;

  return (
    <AuthContext.Provider
      value={{ user, access, refresh, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
