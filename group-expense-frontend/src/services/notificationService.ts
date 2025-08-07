import axios from "axios";
import { supabase } from "../lib/supabase";

const API_BASE_URL = "http://localhost:4000/api";

// Notification type matching the backend schema
export type Notification = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
  groupId?: number;
  group?: {
    id: number;
    name: string;
  };
  metadata?: any;
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
  async getNotifications(): Promise<Notification[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers,
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(
        `${API_BASE_URL}/notifications/unread-count`,
        { headers }
      );
      return response.data.count;
    } catch (error: any) {
      console.error("Failed to get unread count:", error);
      return 0;
    }
  },

  async markAsRead(notificationId: number): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await axios.put(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {},
        { headers }
      );
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await axios.put(
        `${API_BASE_URL}/notifications/mark-all-read`,
        {},
        { headers }
      );
    } catch (error: any) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },
};
