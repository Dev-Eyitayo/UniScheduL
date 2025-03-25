import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();
let globalLogout = () => {};

export const setGlobalLogout = (fn) => {
  globalLogout = fn;
};

export const getGlobalLogout = () => globalLogout;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [access, setAccess] = useState(localStorage.getItem("access"));
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh"));
  const navigate = useNavigate();

  const logout = () => {
    setAccess(null);
    setRefresh(null);
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    toast("Logged out.", { icon: "👋" });
    navigate("/login");
  };

  useEffect(() => {
    setGlobalLogout(logout);
  }, [logout]);

  useEffect(() => {
    const token = access || localStorage.getItem("access");
    if (!token) {
      logout();
      return;
    }

    const [, payload] = token.split(".");
    if (payload) {
      const decoded = JSON.parse(atob(payload));
      const exp = decoded.exp * 1000;
      if (Date.now() > exp) {
        logout();
      }
    }
  }, []);

  const login = ({ tokens, user }, remember = true) => {
    setAccess(tokens.access);
    setRefresh(tokens.refresh);
    setUser(user);

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("access", tokens.access);
    storage.setItem("refresh", tokens.refresh);
    storage.setItem("user", JSON.stringify(user));
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
