import {
  createContext,
  useContext,
  useState,
  type ReactNode
} from 'react';
import api from '../lib/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    const nextToken = response.data.token as string;
    const nextUser = response.data.user as User;

    localStorage.setItem('token', nextToken);
    localStorage.setItem('user', JSON.stringify(nextUser));

    setToken(nextToken);
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}