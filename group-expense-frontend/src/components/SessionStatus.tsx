import React, { useState, useEffect } from "react";
import { Button, Text, Group, ActionIcon, Tooltip } from "@mantine/core";
import { IconClock, IconRefresh } from "@tabler/icons-react";
import { sessionUtils } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export const SessionStatus: React.FC = () => {
  const { user, refreshSession } = useAuth();
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const updateTimer = () => {
      const timeLeft = sessionUtils.getTimeUntilExpiry();
      setTimeUntilExpiry(timeLeft);
    };

    // Update immediately
    updateTimer();

    // Update every 30 seconds
    const interval = setInterval(updateTimer, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    try {
      await refreshSession();
    } catch (error) {
      console.error("Failed to refresh session:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Don't show if not authenticated
  if (!user || timeUntilExpiry <= 0) return null;

  const minutes = Math.floor(timeUntilExpiry / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // Format time display
  let timeDisplay: string;
  if (hours > 0) {
    timeDisplay = `${hours}h ${remainingMinutes}m`;
  } else {
    timeDisplay = `${minutes}m`;
  }

  // Determine color based on time remaining
  const getTimeColor = () => {
    if (minutes <= 5) return "red";
    if (minutes <= 15) return "orange";
    return "gray";
  };

  // Only show if session expires within 30 minutes or user is in warning period
  const shouldShow = minutes <= 30 || sessionUtils.shouldShowWarning();

  if (!shouldShow) return null;

  return (
    <Group gap="xs" className="text-sm">
      <Tooltip label="Session expires in">
        <Group gap={4}>
          <IconClock
            size={16}
            color={
              getTimeColor() === "gray"
                ? "#666"
                : getTimeColor() === "orange"
                ? "#fd7e14"
                : "#fa5252"
            }
          />
          <Text size="sm" c={getTimeColor()}>
            {timeDisplay}
          </Text>
        </Group>
      </Tooltip>

      <Tooltip label="Extend session">
        <ActionIcon
          variant="light"
          size="sm"
          onClick={handleRefreshSession}
          loading={isRefreshing}
          color="blue"
        >
          <IconRefresh size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
