import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import {
  groupService,
  Group as GroupType,
  CreateGroupData,
} from "../services/groupService";

export const useGroups = () => {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchGroups = async () => {
    try {
      setError(null);
      setLoading(true);
      const fetchedGroups = await groupService.getGroups();
      setGroups(fetchedGroups);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      setError(
        "Failed to fetch groups. Please check if the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (data: CreateGroupData): Promise<boolean> => {
    setCreating(true);
    try {
      const newGroup = await groupService.createGroup(data);

      // Success notification
      notifications.show({
        title: "Group Created Successfully",
        message: `Group "${data.name}" has been created!`,
        color: "green",
        autoClose: 4000,
      });

      // Add new group to the list without refetching
      setGroups((prevGroups) => [newGroup, ...prevGroups]);
      return true;
    } catch (err: any) {
      console.error("Failed to create group:", err);

      // Enhanced error handling
      let errorMessage = "Failed to create group. Please try again.";
      if (err.response?.status === 400) {
        errorMessage =
          err.response.data.error || "Invalid group data provided.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.code === "ECONNREFUSED") {
        errorMessage =
          "Cannot connect to server. Please check if the backend is running.";
      }

      notifications.show({
        title: "Error Creating Group",
        message: errorMessage,
        color: "red",
        autoClose: 6000,
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    loading,
    error,
    creating,
    fetchGroups,
    createGroup,
    refreshGroups: fetchGroups, // Alias for clarity
  };
};
