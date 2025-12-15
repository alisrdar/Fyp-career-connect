"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      setUser(res.data);
      setError("");
    } catch (e) {
      // 401 is expected when user is not logged in - don't treat as error
      if (e.response?.status === 401) {
        setUser(null);
        setError("");
      } else {
        console.error("Auth error:", e);
        setError("Failed to load user");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post("/api/auth/login", credentials, { withCredentials: true });
      if (res.status !== 200) {
        throw new Error(res.data?.error || "Login failed");
      }
      await refresh();
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/auth/logout", { withCredentials: true });
    } finally {
      setUser(null);
    }
  };

  const value = { user, loading, error, login, logout, refresh, setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

// Temporary alias to ease migration from useUser
// No alias exports; use `useAuth` directly everywhere
