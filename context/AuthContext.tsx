'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { setLogin, setLogout, getUser, setRegister } from '@/services/auth';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getUser();
      if (response.error) {
        Cookies.remove('token');
        setUser(null);
      } else {
        setUser(response.data);
      }
    } catch (error) {
      Cookies.remove('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (data: any) => {
    setLoading(true);
    const result = await setLogin(data);
    if (result.error) {
      toast.error(result.message);
      setLoading(false);
    } else {
      const token = result.data.token;
      // Encode token to base64 as expected by callAPI
      const tokenBase64 = btoa(token);
      Cookies.set('token', tokenBase64, { expires: 1 }); // 1 day
      toast.success('Login Successful');
      setUser(result.data.user);
      router.push('/');
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    const result = await setRegister(data);
    if (result.error) {
      toast.error(result.message);
      setLoading(false);
    } else {
      const token = result.data.token;
      const tokenBase64 = btoa(token);
      Cookies.set('token', tokenBase64,  { expires: 1 });
      toast.success('Registration Successful');
      setUser(result.data.user);
      router.push('/');
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await setLogout(); // Call API to revoke token
    Cookies.remove('token');
    setUser(null);
    toast.success('Logout Successful');
    router.push('/auth/login');
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);