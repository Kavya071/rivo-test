import React, { createContext, useContext, useState, useEffect } from "react";
import { getMe, logoutAgent } from "./api";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  agent_type: string;
  agent_type_other: string;
  rera_number: string;
  agent_code: string;
  is_whatsapp_business: boolean;
  is_profile_complete: boolean;
  has_completed_first_action: boolean;
  total_earned: string;
  pending_amount: string;
  disbursed_count: number;
  this_month_earned: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithToken: (token: string, agent: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem("rivo_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("rivo_token");
    if (token) {
      getMe()
        .then((agent) => {
          setUser(agent);
          localStorage.setItem("rivo_user", JSON.stringify(agent));
        })
        .catch((err) => {
          // Only clear auth on 401 (invalid token), not on network errors
          if (err?.status === 401) {
            setUser(null);
            localStorage.removeItem("rivo_token");
            localStorage.removeItem("rivo_user");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithToken = (token: string, agent: User) => {
    localStorage.setItem("rivo_token", token);
    localStorage.setItem("rivo_user", JSON.stringify(agent));
    setUser(agent);
  };

  const logout = async () => {
    try {
      await logoutAgent();
    } catch {
      // Ignore errors on logout
    }
    setUser(null);
    localStorage.removeItem("rivo_token");
    localStorage.removeItem("rivo_user");
  };

  const refreshUser = async () => {
    try {
      const agent = await getMe();
      setUser(agent);
      localStorage.setItem("rivo_user", JSON.stringify(agent));
    } catch {
      // If token is invalid, logout
      setUser(null);
      localStorage.removeItem("rivo_token");
      localStorage.removeItem("rivo_user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rivo-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rivo-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loginWithToken, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
