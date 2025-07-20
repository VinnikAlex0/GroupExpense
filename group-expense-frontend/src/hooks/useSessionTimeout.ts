import { useEffect, useCallback, useRef } from "react";
import { notifications } from "@mantine/notifications";
import {
  supabase,
  sessionUtils,
  SESSION_TIMEOUT,
  WARNING_TIME,
} from "../lib/supabase";

interface UseSessionTimeoutProps {
  onSessionExpired: () => void;
  isAuthenticated: boolean;
}

export const useSessionTimeout = ({
  onSessionExpired,
  isAuthenticated,
}: UseSessionTimeoutProps) => {
  const warningShownRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  }, []);

  // Extend session (called when user activity is detected)
  const extendSession = useCallback(() => {
    if (!isAuthenticated) return;

    // Only extend if session is valid and not in warning period
    if (!sessionUtils.isSessionExpired() && !sessionUtils.shouldShowWarning()) {
      // Set new expiry time
      const expiryTime = Date.now() + SESSION_TIMEOUT * 1000;
      sessionUtils.setSessionExpiry(expiryTime);

      // Reset warning flag
      warningShownRef.current = false;

      // Hide any existing warning
      notifications.hide("session-warning");

      // Restart timers
      startSessionTimer();
    }
  }, [isAuthenticated]);

  // Show session warning
  const showSessionWarning = useCallback(() => {
    if (warningShownRef.current) return;

    warningShownRef.current = true;
    const timeUntilExpiry = Math.ceil(
      sessionUtils.getTimeUntilExpiry() / 1000 / 60
    ); // minutes

    notifications.show({
      id: "session-warning",
      title: "Session Expiring Soon",
      message: `Your session will expire in ${timeUntilExpiry} minute(s). Any unsaved changes will be lost. Click anywhere to continue your session.`,
      color: "orange",
      autoClose: false,
      withCloseButton: true,
      onClick: () => {
        extendSession();
        notifications.hide("session-warning");
      },
    });
  }, [extendSession]);

  // Handle session expiry
  const handleSessionExpiry = useCallback(() => {
    // Clear session data
    sessionUtils.removeSessionExpiry();

    // Clear all timers
    clearTimers();

    // Show expiry notification
    notifications.show({
      id: "session-expired",
      title: "Session Expired",
      message:
        "Your session has expired for security reasons. Please log in again.",
      color: "red",
      autoClose: 8000,
    });

    // Call the logout handler
    onSessionExpired();
  }, [onSessionExpired, clearTimers]);

  // Start session timer
  const startSessionTimer = useCallback(() => {
    clearTimers();

    const expiryTime = sessionUtils.getSessionExpiry();
    if (!expiryTime) return;

    const timeUntilExpiry = expiryTime - Date.now();
    const timeUntilWarning = timeUntilExpiry - WARNING_TIME * 1000;

    // Set warning timer
    if (timeUntilWarning > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        showSessionWarning();
      }, timeUntilWarning);
    } else if (timeUntilExpiry > 0) {
      // Session expires soon, show warning immediately
      showSessionWarning();
    }

    // Set expiry timer
    if (timeUntilExpiry > 0) {
      timeoutRef.current = setTimeout(() => {
        handleSessionExpiry();
      }, timeUntilExpiry);
    } else {
      // Session already expired
      handleSessionExpiry();
    }

    // Set up periodic checking (every minute)
    checkIntervalRef.current = setInterval(() => {
      if (sessionUtils.isSessionExpired()) {
        handleSessionExpiry();
      } else if (sessionUtils.shouldShowWarning() && !warningShownRef.current) {
        showSessionWarning();
      }
    }, 60 * 1000); // Check every minute
  }, [clearTimers, showSessionWarning, handleSessionExpiry]);

  // Initialize session timer
  const initializeSessionTimer = useCallback(() => {
    if (!isAuthenticated) {
      clearTimers();
      sessionUtils.removeSessionExpiry();
      return;
    }

    // Check if session data exists
    let expiryTime = sessionUtils.getSessionExpiry();

    if (!expiryTime) {
      // No expiry time set, create one
      expiryTime = Date.now() + SESSION_TIMEOUT * 1000;
      sessionUtils.setSessionExpiry(expiryTime);
    }

    // Check if session is already expired
    if (sessionUtils.isSessionExpired()) {
      handleSessionExpiry();
      return;
    }

    startSessionTimer();
  }, [isAuthenticated, clearTimers, handleSessionExpiry, startSessionTimer]);

  // Activity listener to extend session on user interaction
  const handleUserActivity = useCallback(() => {
    if (!isAuthenticated) return;

    // Only extend if session is valid and not in warning period
    if (!sessionUtils.isSessionExpired() && !sessionUtils.shouldShowWarning()) {
      extendSession();
    }
  }, [isAuthenticated, extendSession]);

  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];
    const throttledActivity = throttle(handleUserActivity, 30000); // Throttle to every 30 seconds

    events.forEach((event) => {
      document.addEventListener(event, throttledActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, throttledActivity, true);
      });
    };
  }, [isAuthenticated, handleUserActivity]);

  // Initialize when authentication state changes
  useEffect(() => {
    initializeSessionTimer();

    return () => {
      clearTimers();
    };
  }, [isAuthenticated, initializeSessionTimer, clearTimers]);

  return {
    extendSession,
    clearTimers,
  };
};

// Throttle utility
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}
