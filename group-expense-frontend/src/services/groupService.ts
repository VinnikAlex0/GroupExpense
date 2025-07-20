import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

export type Group = {
  id: number;
  name: string;
  createdBy: string;
  createdAt: string;
};

export type CreateGroupData = {
  name: string;
  createdBy: string;
};

export const groupService = {
  async getGroups(): Promise<Group[]> {
    const response = await axios.get(`${API_BASE_URL}/groups`);
    return response.data;
  },

  async createGroup(data: CreateGroupData): Promise<Group> {
    const response = await axios.post(`${API_BASE_URL}/groups`, {
      name: data.name.trim(),
      createdBy: data.createdBy.trim(),
    });
    return response.data;
  },
};
