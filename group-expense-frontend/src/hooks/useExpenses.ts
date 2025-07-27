import { useState, useEffect, useCallback } from "react";
import {
  expenseService,
  Expense,
  CreateExpenseData,
  UpdateExpenseData,
  Category,
  GroupSummary,
} from "../services/expenseService";
import { notifications } from "@mantine/notifications";

export const useExpenses = (groupId: number) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<GroupSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    if (!groupId) {
      console.log("useExpenses: No groupId provided");
      return;
    }

    // console.log("useExpenses: Fetching expenses for groupId:", groupId);
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getExpensesByGroup(groupId);
      // console.log("useExpenses: Received expenses data:", data);
      setExpenses(data);
    } catch (err) {
      console.error("useExpenses: Error fetching expenses:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to load expenses";
      setError(errorMsg);
      notifications.show({
        title: "Error",
        message: errorMsg,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await expenseService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    if (!groupId) return;

    try {
      const data = await expenseService.getGroupSummary(groupId);
      setSummary(data);
    } catch (err) {
      console.error("Failed to load summary:", err);
    }
  }, [groupId]);

  const createExpense = useCallback(
    async (expenseData: CreateExpenseData) => {
      setCreating(true);
      setError(null);
      try {
        const newExpense = await expenseService.createExpense(expenseData);
        setExpenses((prev) => [newExpense, ...prev]);

        notifications.show({
          title: "Success",
          message: "Expense added successfully",
          color: "green",
        });

        // Refresh summary after adding expense
        fetchSummary();
        return newExpense;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to create expense";
        setError(errorMsg);
        notifications.show({
          title: "Error",
          message: errorMsg,
          color: "red",
        });
        throw err;
      } finally {
        setCreating(false);
      }
    },
    [fetchSummary]
  );

  const updateExpense = useCallback(
    async (expenseId: number, expenseData: UpdateExpenseData) => {
      setUpdating(true);
      setError(null);
      try {
        const updatedExpense = await expenseService.updateExpense(
          expenseId,
          expenseData
        );
        setExpenses((prev) =>
          prev.map((expense) =>
            expense.id === expenseId ? updatedExpense : expense
          )
        );

        notifications.show({
          title: "Success",
          message: "Expense updated successfully",
          color: "green",
        });

        // Refresh summary after updating expense
        fetchSummary();
        return updatedExpense;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to update expense";
        setError(errorMsg);
        notifications.show({
          title: "Error",
          message: errorMsg,
          color: "red",
        });
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [fetchSummary]
  );

  const deleteExpense = useCallback(
    async (expenseId: number) => {
      setError(null);
      try {
        await expenseService.deleteExpense(expenseId);
        setExpenses((prev) =>
          prev.filter((expense) => expense.id !== expenseId)
        );

        notifications.show({
          title: "Success",
          message: "Expense deleted successfully",
          color: "green",
        });

        // Refresh summary after deleting expense
        fetchSummary();
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to delete expense";
        setError(errorMsg);
        notifications.show({
          title: "Error",
          message: errorMsg,
          color: "red",
        });
        throw err;
      }
    },
    [fetchSummary]
  );

  // Load data on mount and when groupId changes
  useEffect(() => {
    fetchExpenses();
    fetchCategories();
    fetchSummary();
  }, [fetchExpenses, fetchCategories, fetchSummary]);

  return {
    expenses,
    categories,
    summary,
    loading,
    creating,
    updating,
    error,
    fetchExpenses,
    fetchCategories,
    fetchSummary,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};
