import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

// Session timeout configuration (in seconds)
// Default to 2 hours (7200 seconds) if not specified
const sessionTimeoutMinutes = process.env.REACT_APP_SESSION_TIMEOUT_MINUTES
  ? parseInt(process.env.REACT_APP_SESSION_TIMEOUT_MINUTES, 10)
  : 120; // 2 hours default

// Warning time (in seconds)
// Default to 5 minutes if not specified
const warningTimeMinutes = process.env.REACT_APP_SESSION_WARNING_MINUTES
  ? parseInt(process.env.REACT_APP_SESSION_WARNING_MINUTES, 10)
  : 5; // 5 minutes default

export const SESSION_TIMEOUT = sessionTimeoutMinutes * 60; // Convert to seconds
export const WARNING_TIME = warningTimeMinutes * 60; // Convert to seconds

// Create Supabase client with enhanced security settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Enhanced security settings
    storageKey: "sb-auth-token",
    // Custom session settings
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
  // Additional security headers
  global: {
    headers: {
      "X-Client-Info": "group-expense-frontend",
    },
  },
});

// Type for our user profiles
export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
};

// Session management utilities
export const sessionUtils = {
  // Get session expiry time
  getSessionExpiry: (): number | null => {
    if (typeof window === "undefined") return null;

    const expiryTime = localStorage.getItem("session-expiry");
    return expiryTime ? parseInt(expiryTime, 10) : null;
  },

  // Set session expiry time
  setSessionExpiry: (expiresAt: number): void => {
    if (typeof window === "undefined") return;

    localStorage.setItem("session-expiry", expiresAt.toString());
  },

  // Remove session expiry
  removeSessionExpiry: (): void => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("session-expiry");
  },

  // Check if session is expired
  isSessionExpired: (): boolean => {
    const expiryTime = sessionUtils.getSessionExpiry();
    if (!expiryTime) return false;

    return Date.now() > expiryTime;
  },

  // Get time until expiry (in milliseconds)
  getTimeUntilExpiry: (): number => {
    const expiryTime = sessionUtils.getSessionExpiry();
    if (!expiryTime) return 0;

    return Math.max(0, expiryTime - Date.now());
  },

  // Check if warning should be shown
  shouldShowWarning: (): boolean => {
    const timeUntilExpiry = sessionUtils.getTimeUntilExpiry();
    return timeUntilExpiry > 0 && timeUntilExpiry <= WARNING_TIME * 1000;
  },

  // Get current session timeout configuration (for display purposes)
  getSessionConfig: () => ({
    timeoutMinutes: sessionTimeoutMinutes,
    warningMinutes: warningTimeMinutes,
    timeoutSeconds: SESSION_TIMEOUT,
    warningSeconds: WARNING_TIME,
  }),
};
