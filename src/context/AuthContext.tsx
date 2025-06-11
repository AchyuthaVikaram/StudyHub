import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const session = localStorage.getItem("supabase-session");
      if (session) {
        try {
          const res = await api.auth.getCurrentUser();
          if (res.user) {
            setUser(res.user);
            setProfile(res.profile);
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch {
          setUser(null);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const logout = async () => {
    await api.auth.logout();
    localStorage.removeItem("supabase-session");
    setUser(null);
    setProfile(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 