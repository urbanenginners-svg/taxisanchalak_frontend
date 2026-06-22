import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth';
import { clearToken, getToken, saveToken } from '../api/client';
import type { AuthPayload, User } from '../types';

type RoleSlug = 'admin' | 'driver' | null;

interface AuthContextValue {
  user: User | null;
  role: RoleSlug;
  loading: boolean;
  loginDriver: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  registerDriver: (data: Parameters<typeof authApi.registerDriver>[0]) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getRoleSlug(user: User | null): RoleSlug {
  if (!user?.role) return null;
  const role = user.role;
  if (typeof role === 'string') return null;
  return role.slug;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const res = await authApi.getMe();
    setUser(res.data.data);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) await refreshUser();
      } catch {
        await clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshUser]);

  const applyAuth = async (payload: AuthPayload) => {
    await saveToken(payload.access_token);
    setUser({
      _id: payload.userId,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      firstName: payload.firstName,
      lastName: payload.lastName,
      profilePic: payload.profilePic,
      role: payload.role,
    });
    await refreshUser();
  };

  const loginDriver = async (email: string, password: string) => {
    const res = await authApi.driverLogin({ email, password });
    await applyAuth(res.data.data);
  };

  const loginAdmin = async (email: string, password: string) => {
    const res = await authApi.adminLogin({ email, password });
    await applyAuth(res.data.data);
  };

  const registerDriver = async (
    data: Parameters<typeof authApi.registerDriver>[0],
  ) => {
    const res = await authApi.registerDriver(data);
    await applyAuth(res.data.data);
  };

  const logout = async () => {
    await clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: getRoleSlug(user),
        loading,
        loginDriver,
        loginAdmin,
        registerDriver,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
