// context/UserContext.jsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]       = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/dashboard/profile/getuser", { withCredentials: true });
        setUser(data);
      } catch (e) {
        console.error(e);
        setErr(e.response?.data?.error || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, err,setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// custom hook for easy consumption
export function useUser() {
  return useContext(UserContext);
}
