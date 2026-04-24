import React, { createContext, useEffect, useState } from 'react';
import type { User, Admin } from '../types';
import { adminService } from '../services/adminService';
import { userService } from '../services/userService';

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInAsAdmin: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 AuthContext: Initializing...');
    setLoading(true);
    
    const storedAdmin = localStorage.getItem('admin');
    console.log('📦 Stored admin in localStorage:', storedAdmin ? 'Found' : 'Not found');
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        console.log('✅ Admin data loaded:', { id: adminData.id, email: adminData.email });
        setAdmin(adminData);
      } catch {
        console.error('❌ Failed to parse admin data, removing from localStorage');
        localStorage.removeItem('admin');
      }
    }

    const storedUser = localStorage.getItem('user');
    console.log('📦 Stored user in localStorage:', storedUser ? 'Found' : 'Not found');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('✅ User data loaded:', { id: userData.id, email: userData.email });
        setUser(userData);
      } catch {
        console.error('❌ Failed to parse user data, removing from localStorage');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
    console.log('🎉 AuthContext: Initialization complete');
  }, []);

  const signIn = async (email: string, password: string) => {
    const userData = await userService.login(email, password);
    if (!userData) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signInAsAdmin = async (email: string, password: string) => {
    console.log('🔍 Attempting admin login...', { email });
    const adminData = await adminService.login(email, password);
    console.log('📦 Admin service response:', adminData ? 'Success' : 'Failed');
    
    if (!adminData) {
      throw new Error('Invalid admin credentials');
    }
    
    console.log('✅ Setting admin data in state and localStorage');
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
    console.log('🎉 Admin login complete!');
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    const newUser = await userService.register({
      email,
      password,
      full_name: userData.full_name || '',
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      country: userData.country,
    } as Omit<User, 'id' | 'created_at'>);

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const signOut = async () => {
    if (admin) {
      setAdmin(null);
      localStorage.removeItem('admin');
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const isAdmin = admin !== null;

  return (
    <AuthContext.Provider value={{ user, admin, loading, signIn, signInAsAdmin, signUp, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
