import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "teacher" | "student";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, User> = {
  admin: { id: "1", name: "Admin", email: "admin@escola.com", role: "admin" },
  teacher: { id: "2", name: "Prof. Maria Silva", email: "maria@escola.com", role: "teacher" },
  student: { id: "3", name: "João Santos", email: "joao@escola.com", role: "student" },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => setUser(DEMO_USERS[role]);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
