import axios from "axios";
import { supabase } from "../lib/supabase";

const API_BASE_URL = "http://localhost:4000/api";

export type Group = {
  id: number;
  name: string;
  createdBy: string;
  userId: string; // Required - all groups belong to a user
  createdAt: string;
};

export type CreateGroupData = {
  name: string;
  // Note: createdBy is no longer needed as it comes from auth
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

export const groupService = {
  async getGroups(): Promise<Group[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/groups`, { headers });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      throw error;
    }
  },

  async createGroup(data: CreateGroupData): Promise<Group> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${API_BASE_URL}/groups`,
        { name: data.name }, // Only send name, user info comes from auth
        { headers }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || "Invalid group data");
      }
      throw error;
    }
  },
};
