import axios from "axios";
import { supabase } from "../lib/supabase";

const API_BASE_URL = "http://localhost:4000/api";

// Basic notification type for now (can be expanded when backend is updated)
export type Notification = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
  groupId?: number;
  groupName?: string;
};

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("No authentication token available");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
};

export const notificationService = {
  // For now, we'll simulate notifications with localStorage
  // This will be replaced when the backend notification system is implemented
  async getNotifications(): Promise<Notification[]> {
    try {
      // Placeholder: In the future, this would be:
      // const headers = await getAuthHeaders();
      // const response = await axios.get(`${API_BASE_URL}/notifications`, { headers });
      // return response.data;

      // For now, return mock notifications stored in localStorage
      const stored = localStorage.getItem("groupexpense_notifications");
      return stored ? JSON.parse(stored) : [];
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter((n) => !n.isRead).length;
    } catch (error: any) {
      console.error("Failed to get unread count:", error);
      return 0;
    }
  },

  async markAsRead(notificationId: number): Promise<void> {
    try {
      // Placeholder: In the future, this would be:
      // const headers = await getAuthHeaders();
      // await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, { headers });

      // For now, update localStorage
      const notifications = await this.getNotifications();
      const updated = notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      localStorage.setItem(
        "groupexpense_notifications",
        JSON.stringify(updated)
      );
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      // Placeholder: In the future, this would be:
      // const headers = await getAuthHeaders();
      // await axios.put(`${API_BASE_URL}/notifications/mark-all-read`, {}, { headers });

      // For now, update localStorage
      const notifications = await this.getNotifications();
      const updated = notifications.map((n) => ({ ...n, isRead: true }));
      localStorage.setItem(
        "groupexpense_notifications",
        JSON.stringify(updated)
      );
    } catch (error: any) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },

  // Helper method to create a mock notification (for demo purposes)
  async createMockNotification(
    title: string,
    message: string,
    type: string = "GROUP_INVITATION",
    groupId?: number,
    groupName?: string
  ): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const newNotification: Notification = {
        id: Date.now(),
        title,
        message,
        isRead: false,
        createdAt: new Date().toISOString(),
        type,
        groupId,
        groupName,
      };
      const updated = [newNotification, ...notifications];
      localStorage.setItem(
        "groupexpense_notifications",
        JSON.stringify(updated)
      );
    } catch (error: any) {
      console.error("Failed to create mock notification:", error);
    }
  },
};
