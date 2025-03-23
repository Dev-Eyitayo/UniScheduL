import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [access, setAccess] = useState(localStorage.getItem("access"));
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh"));
  const navigate = useNavigate();
  useEffect(() => {
    const token = access || localStorage.getItem("access") || sessionStorage.getItem("access");
  
    if (!token) {
      logout(); // force logout if nothing exists
    }
  }, []);

  const login = ({ tokens, user }, remember = true) => {
    setAccess(tokens.access);
    setRefresh(tokens.refresh);
    setUser(user);
  
    if (remember) {
      localStorage.setItem("access", tokens.access);
      localStorage.setItem("refresh", tokens.refresh);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("access", tokens.access);
      sessionStorage.setItem("refresh", tokens.refresh);
      sessionStorage.setItem("user", JSON.stringify(user));
    }
    toast.success("Welcome back!");
  };
  

  const logout = () => {
    setAccess(null);
    setRefresh(null);
    setUser(null);
    localStorage.clear();
    toast("Logged out successfully.", { icon: "👋" });
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
