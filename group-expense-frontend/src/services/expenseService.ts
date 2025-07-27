import axios from "axios";
import { supabase } from "../lib/supabase";

const API_BASE_URL = "http://localhost:4000/api";

// Types for expense management
export type Category = {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isDefault: boolean;
  createdAt: string;
};

export type Expense = {
  id: number;
  amount: string; // Decimal as string from API
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  groupId: number;
  paidById: string;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
    icon?: string;
    color?: string;
  };
  paidBy?: {
    email: string;
    name?: string;
  };
};

export type CreateExpenseData = {
  amount: number;
  description: string;
  date?: string;
  categoryId?: number;
  groupId: number;
};

export type UpdateExpenseData = {
  amount?: number;
  description?: string;
  date?: string;
  categoryId?: number;
};

export type GroupSummary = {
  total: {
    amount: string;
    expenseCount: { id: number }; // Prisma _count returns { id: count }
  };
  byCategory: Array<{
    category: {
      id?: number;
      name: string;
      icon?: string;
      color?: string;
    };
    totalAmount: string;
    expenseCount: number;
  }>;
  byMember: Array<{
    member: {
      email: string;
      name?: string;
    };
    totalAmount: string;
    expenseCount: number;
  }>;
};

// Helper to get auth token
const getAuthToken = async (): Promise<string> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("No valid session found");
  }
  return session.access_token;
};

// API functions
const createExpense = async (
  expenseData: CreateExpenseData
): Promise<Expense> => {
  const token = await getAuthToken();
  const response = await axios.post(`${API_BASE_URL}/expenses`, expenseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getExpensesByGroup = async (groupId: number): Promise<Expense[]> => {
  const token = await getAuthToken();
  const response = await axios.get(
    `${API_BASE_URL}/groups/${groupId}/expenses`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const updateExpense = async (
  expenseId: number,
  expenseData: UpdateExpenseData
): Promise<Expense> => {
  const token = await getAuthToken();
  const response = await axios.put(
    `${API_BASE_URL}/expenses/${expenseId}`,
    expenseData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const deleteExpense = async (expenseId: number): Promise<void> => {
  const token = await getAuthToken();
  await axios.delete(`${API_BASE_URL}/expenses/${expenseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getCategories = async (): Promise<Category[]> => {
  const token = await getAuthToken();
  const response = await axios.get(`${API_BASE_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getGroupSummary = async (groupId: number): Promise<GroupSummary> => {
  const token = await getAuthToken();
  const response = await axios.get(
    `${API_BASE_URL}/groups/${groupId}/summary`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const expenseService = {
  createExpense,
  getExpensesByGroup,
  updateExpense,
  deleteExpense,
  getCategories,
  getGroupSummary,
};
