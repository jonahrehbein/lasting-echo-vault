import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for testing
const dummyUsers = [
  { id: '1', email: 'demo@example.com', password: 'password', name: 'Demo User' },
  { id: '2', email: 'test@example.com', password: 'test123', name: 'Test User' }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check dummy users
    const foundUser = dummyUsers.find(u => u.email === email && u.password === password);
    
    // Check registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const registeredUser = registeredUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser || registeredUser) {
      const authUser = foundUser || registeredUser;
      const userData = {
        id: authUser.id || Date.now().toString(),
        email: authUser.email,
        name: authUser.name || authUser.email.split('@')[0]
      };
      
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string, name?: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const existingUser = registeredUsers.find((u: any) => u.email === email);
    const dummyUser = dummyUsers.find(u => u.email === email);
    
    if (existingUser || dummyUser) {
      setIsLoading(false);
      return false; // User already exists
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name: name || email.split('@')[0]
    };
    
    // Save to registered users
    registeredUsers.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
    
    // Auto-login after signup
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    };
    
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}