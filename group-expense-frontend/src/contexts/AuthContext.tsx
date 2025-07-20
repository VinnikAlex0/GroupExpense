import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User, AuthError } from "@supabase/supabase-js";
import { supabase, sessionUtils } from "../lib/supabase";
import { useSessionTimeout } from "../hooks/useSessionTimeout";

// Define what our auth context will provide
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle session expiry - sign out user
  const handleSessionExpired = useCallback(async () => {
    console.log("Session expired, signing out user");
    try {
      await supabase.auth.signOut();
      sessionUtils.removeSessionExpiry();
      setUser(null);
    } catch (error) {
      console.error("Error during session expiry logout:", error);
      // Force clear the user state even if signOut fails
      setUser(null);
      sessionUtils.removeSessionExpiry();
    }
  }, []);

  // Initialize session timeout hook
  useSessionTimeout({
    onSessionExpired: handleSessionExpired,
    isAuthenticated: !!user,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Check if session is expired on initial load
        if (session?.user && sessionUtils.isSessionExpired()) {
          console.log("Initial session check: session expired");
          await handleSessionExpired();
          setLoading(false);
          return;
        }

        setUser(session?.user ?? null);

        // Set session expiry if user is logged in and no expiry is set
        if (session?.user && !sessionUtils.getSessionExpiry()) {
          const expiryTime = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
          sessionUtils.setSessionExpiry(expiryTime);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        sessionUtils.removeSessionExpiry();
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session.user);
        // Set new session expiry
        const expiryTime = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
        sessionUtils.setSessionExpiry(expiryTime);
      }

      setLoading(false);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [handleSessionExpired]);

  // Sign up function
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Session expiry will be set automatically via onAuthStateChange
    return { error };
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      sessionUtils.removeSessionExpiry();
    } catch (error) {
      console.error("Error signing out:", error);
      // Clear local state even if signOut fails
      setUser(null);
      sessionUtils.removeSessionExpiry();
    }
  };

  // Manual session refresh function
  const refreshSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();

      if (error) {
        console.error("Session refresh failed:", error);
        await handleSessionExpired();
        return;
      }

      if (session) {
        // Update session expiry
        const expiryTime = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
        sessionUtils.setSessionExpiry(expiryTime);
        console.log("Session refreshed manually");
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      await handleSessionExpired();
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
