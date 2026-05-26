// src/lib/auth.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  apiFetch,
  clearToken,
  getToken,
  setToken,
} from './api';

/* =========================
   TYPES
========================= */

interface User {
  userId?: number;

  email?: string;
  name?: string;

  role?: string;
  company?: string;
  college?: string;

  github?: string;
  linkedin?: string;

  country?: string;
  state?: string;
  city?: string;
}

interface SignUpPayload {
  email: string;
  password: string;

  role?: string;
  company?: string;
  college?: string;

  github?: string;
  linkedin?: string;

  country: string;
  state: string;
  city: string;

  name: string;
}

interface JwtResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;

  user: User | null;

  signIn: (
    email: string,
    password: string
  ) => Promise<void>;

  signUp: (
    payload: SignUpPayload
  ) => Promise<void>;

  signOut: () => void;
}

/* =========================
   CONTEXT
========================= */

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

/* =========================
   PROVIDER
========================= */

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [token, setTokenState] =
    useState<string | null>(null);

  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  /* =========================
     INIT AUTH
  ========================= */

  useEffect(() => {
    const initAuth = async () => {
      try {
        const activeToken = getToken();

        if (!activeToken) {
          setIsLoading(false);
          return;
        }

        setTokenState(activeToken);

        // verify token
        const profile =
          await apiFetch<User>('profile/profile');

        setUser(profile);
      } catch (error) {
        console.error(
          'Session restore failed:',
          error
        );

        clearToken();
        setTokenState(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    /* auto logout listener */

    const handleAutoLogout = () => {
      clearToken();
      setTokenState(null);
      setUser(null);
    };

    window.addEventListener(
      'auth_logout',
      handleAutoLogout
    );

    return () => {
      window.removeEventListener(
        'auth_logout',
        handleAutoLogout
      );
    };
  }, []);

  /* =========================
     SIGN IN
  ========================= */

  const signIn = async (
    email: string,
    password: string
  ) => {
    setIsLoading(true);

    try {
      const response =
        await apiFetch<JwtResponse>(
          'auth/signin',
          {
            method: 'POST',

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const extractedToken =
        response.token ||
        response.accessToken ||
        response.jwt;

      if (!extractedToken) {
        throw new Error(
          'Authentication token missing.'
        );
      }

      // save token
      setToken(extractedToken);

      setTokenState(extractedToken);

      // fetch profile
      const profile =
        await apiFetch<User>('profile/profile');

      setUser(profile);
    } catch (error) {
      console.error('Sign in failed:', error);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     SIGN UP
  ========================= */

  const signUp = async (
    payload: SignUpPayload
  ) => {
    setIsLoading(true);

    try {
      const response =
        await apiFetch<JwtResponse>(
          'auth/signup',
          {
            method: 'POST',

            body: JSON.stringify(payload),
          }
        );

      const extractedToken =
        response.token ||
        response.accessToken ||
        response.jwt;

      if (!extractedToken) {
        throw new Error(
          'Signup token missing.'
        );
      }

      // save jwt
      setToken(extractedToken);

      setTokenState(extractedToken);

      // fetch profile
      const profile =
        await apiFetch<User>('profile/profile');

      setUser(profile);
    } catch (error) {
      console.error('Signup failed:', error);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     SIGN OUT
  ========================= */

  const signOut = () => {
    clearToken();

    setTokenState(null);

    setUser(null);
  };

  /* =========================
     CONTEXT VALUE
  ========================= */

  const value: AuthContextType = {
    isAuthenticated: !!token,

    token,

    isLoading,

    user,

    signIn,

    signUp,

    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   HOOK
========================= */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
};