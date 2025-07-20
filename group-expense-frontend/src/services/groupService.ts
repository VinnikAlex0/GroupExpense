import axios from "axios";
import { supabase } from "../lib/supabase";

const API_BASE_URL = "http://localhost:4000/api";

// Enums to match backend
export enum Role {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

// Types for the new multi-user architecture
export type GroupMember = {
  id: number;
  userId: string;
  email: string;
  name?: string;
  role: Role;
  joinedAt: string;
};

export type Group = {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  userRole?: Role; // Current user's role in this group
  _count: {
    expenses: number;
  };
};

export type CreateGroupData = {
  name: string;
  description?: string;
};

export type AddMemberData = {
  email: string;
  role?: Role;
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

  async getGroupById(id: number): Promise<Group> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/groups/${id}`, {
        headers,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (error.response?.status === 404) {
        throw new Error("Group not found.");
      }
      throw error;
    }
  },

  async createGroup(data: CreateGroupData): Promise<Group> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/groups`, data, {
        headers,
      });
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

  async addMember(groupId: number, data: AddMemberData): Promise<GroupMember> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${API_BASE_URL}/groups/${groupId}/members`,
        data,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (error.response?.status === 403) {
        throw new Error(
          "You don't have permission to add members to this group."
        );
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || "Failed to add member");
      }
      throw error;
    }
  },

  async updateMemberRole(
    groupId: number,
    memberId: number,
    role: Role
  ): Promise<GroupMember> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(
        `${API_BASE_URL}/groups/${groupId}/members/${memberId}`,
        { role },
        { headers }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to update member roles.");
      }
      throw error;
    }
  },

  async removeMember(groupId: number, memberId: number): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await axios.delete(
        `${API_BASE_URL}/groups/${groupId}/members/${memberId}`,
        { headers }
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to remove members.");
      }
      throw error;
    }
  },

  async deleteGroup(id: number): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${API_BASE_URL}/groups/${id}`, { headers });
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      if (error.response?.status === 403) {
        throw new Error("Only group owners can delete groups.");
      }
      throw error;
    }
  },
};
