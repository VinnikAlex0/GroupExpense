import { Request, Response } from "express";
import prisma from "../prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const createExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { amount, description, date, categoryId, groupId } = req.body;

  // Validate required fields
  if (!amount || !description || !groupId) {
    res.status(400).json({
      error: "Amount, description, and group ID are required",
    });
    return;
  }

  // Ensure user is authenticated
  if (!req.user) {
    res.status(401).json({
      error: "User authentication required",
    });
    return;
  }

  try {
    // Verify user is a member of the group
    const groupMember = await prisma.groupMember.findFirst({
      where: {
        groupId: parseInt(groupId),
        userId: req.user.id,
      },
    });

    if (!groupMember) {
      res.status(403).json({
        error: "You must be a member of this group to add expenses",
      });
      return;
    }

    // Create the expense
    const newExpense = await prisma.expense.create({
      data: {
        amount: new Decimal(amount),
        description: description.trim(),
        date: date ? new Date(date) : new Date(),
        groupId: parseInt(groupId),
        paidById: req.user.id,
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    res.status(201).json(newExpense);
  } catch (err) {
    console.error("Failed to create expense:", err);
    res.status(500).json({ error: "Failed to create expense" });
  }
};

export const getExpensesByGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { groupId } = req.params;

  // Ensure user is authenticated
  if (!req.user) {
    res.status(401).json({
      error: "User authentication required",
    });
    return;
  }

  try {
    // Verify user is a member of the group
    const groupMember = await prisma.groupMember.findFirst({
      where: {
        groupId: parseInt(groupId),
        userId: req.user.id,
      },
    });

    if (!groupMember) {
      res.status(403).json({
        error: "You must be a member of this group to view expenses",
      });
      return;
    }

    // Get all expenses for the group
    const expenses = await prisma.expense.findMany({
      where: {
        groupId: parseInt(groupId),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    // Add member information for who paid
    const expensesWithPaidBy = await Promise.all(
      expenses.map(async (expense) => {
        const paidByMember = await prisma.groupMember.findFirst({
          where: {
            groupId: parseInt(groupId),
            userId: expense.paidById,
          },
          select: {
            email: true,
            name: true,
          },
        });

        return {
          ...expense,
          paidBy: paidByMember,
        };
      })
    );

    res.status(200).json(expensesWithPaidBy);
  } catch (err) {
    console.error("Failed to fetch expenses:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

export const updateExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { amount, description, date, categoryId } = req.body;

  // Ensure user is authenticated
  if (!req.user) {
    res.status(401).json({
      error: "User authentication required",
    });
    return;
  }

  try {
    // Get the expense and verify user owns it
    const expense = await prisma.expense.findFirst({
      where: {
        id: parseInt(id),
        paidById: req.user.id,
      },
    });

    if (!expense) {
      res.status(404).json({
        error: "Expense not found or you don't have permission to edit it",
      });
      return;
    }

    // Update the expense
    const updatedExpense = await prisma.expense.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...(amount && { amount: new Decimal(amount) }),
        ...(description && { description: description.trim() }),
        ...(date && { date: new Date(date) }),
        ...(categoryId !== undefined && {
          categoryId: categoryId ? parseInt(categoryId) : null,
        }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    res.status(200).json(updatedExpense);
  } catch (err) {
    console.error("Failed to update expense:", err);
    res.status(500).json({ error: "Failed to update expense" });
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  // Ensure user is authenticated
  if (!req.user) {
    res.status(401).json({
      error: "User authentication required",
    });
    return;
  }

  try {
    // Get the expense and verify user owns it
    const expense = await prisma.expense.findFirst({
      where: {
        id: parseInt(id),
        paidById: req.user.id,
      },
    });

    if (!expense) {
      res.status(404).json({
        error: "Expense not found or you don't have permission to delete it",
      });
      return;
    }

    // Delete the expense
    await prisma.expense.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Failed to delete expense:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Ensure user is authenticated
  if (!req.user) {
    res.status(401).json({
      error: "User authentication required",
    });
    return;
  }

  try {
    // Get all available categories
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getGroupSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { groupId } = req.params;

  // Ensure user is authenticated
  if (!req.user) {
    res.status(401).json({
      error: "User authentication required",
    });
    return;
  }

  try {
    // Verify user is a member of the group
    const groupMember = await prisma.groupMember.findFirst({
      where: {
        groupId: parseInt(groupId),
        userId: req.user.id,
      },
    });

    if (!groupMember) {
      res.status(403).json({
        error: "You must be a member of this group to view summary",
      });
      return;
    }

    // Get total expenses
    const totalExpenses = await prisma.expense.aggregate({
      where: {
        groupId: parseInt(groupId),
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // Get expenses by category
    const expensesByCategory = await prisma.expense.groupBy({
      by: ["categoryId"],
      where: {
        groupId: parseInt(groupId),
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // Add category details
    const categoryDetails = await Promise.all(
      expensesByCategory.map(async (item) => {
        const category = item.categoryId
          ? await prisma.category.findUnique({
              where: { id: item.categoryId },
              select: { id: true, name: true, icon: true, color: true },
            })
          : {
              id: null,
              name: "Uncategorized",
              icon: "help-circle",
              color: "#636e72",
            };

        return {
          category,
          totalAmount: item._sum.amount,
          expenseCount: item._count.id,
        };
      })
    );

    // Get expenses by member
    const expensesByMember = await prisma.expense.groupBy({
      by: ["paidById"],
      where: {
        groupId: parseInt(groupId),
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // Add member details
    const memberDetails = await Promise.all(
      expensesByMember.map(async (item) => {
        const member = await prisma.groupMember.findFirst({
          where: {
            groupId: parseInt(groupId),
            userId: item.paidById,
          },
          select: { email: true, name: true },
        });

        return {
          member,
          totalAmount: item._sum.amount,
          expenseCount: item._count.id,
        };
      })
    );

    const summary = {
      total: {
        amount: totalExpenses._sum.amount || 0,
        expenseCount: totalExpenses._count || 0,
      },
      byCategory: categoryDetails,
      byMember: memberDetails,
    };

    res.status(200).json(summary);
  } catch (err) {
    console.error("Failed to fetch group summary:", err);
    res.status(500).json({ error: "Failed to fetch group summary" });
  }
};
