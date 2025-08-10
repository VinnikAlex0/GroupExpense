"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupSummary = exports.getCategories = exports.deleteExpense = exports.updateExpense = exports.getExpensesByGroup = exports.createExpense = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const library_1 = require("@prisma/client/runtime/library");
const createExpense = async (req, res) => {
    const { amount, description, date, categoryId, groupId, participants, shares, } = req.body;
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
        const groupMember = await client_1.default.groupMember.findFirst({
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
        // Determine participant userIds
        const allMembers = await client_1.default.groupMember.findMany({
            where: { groupId: parseInt(groupId) },
            select: { userId: true },
            orderBy: { userId: "asc" },
        });
        if (allMembers.length === 0) {
            res.status(400).json({ error: "Group has no members" });
            return;
        }
        const participantIds = Array.isArray(participants) && participants.length > 0
            ? Array.from(new Set(participants))
            : allMembers.map((m) => m.userId);
        // Validate participants are group members
        const groupMemberIds = new Set(allMembers.map((m) => m.userId));
        for (const uid of participantIds) {
            if (!groupMemberIds.has(uid)) {
                res.status(400).json({ error: "Participants must be group members" });
                return;
            }
        }
        let finalShares = [];
        const totalCents = Math.round(Number(amount) * 100);
        if (Array.isArray(shares) && shares.length > 0) {
            // Validate provided shares
            const seen = new Set();
            let sumCents = 0;
            for (const s of shares) {
                if (!s || typeof s.userId !== "string") {
                    res.status(400).json({ error: "Invalid share entry" });
                    return;
                }
                if (!participantIds.includes(s.userId) || seen.has(s.userId)) {
                    res
                        .status(400)
                        .json({
                        error: "Shares must match participants with no duplicates",
                    });
                    return;
                }
                const shareAmt = typeof s.amount === "string"
                    ? parseFloat(s.amount)
                    : Number(s.amount || 0);
                if (shareAmt < 0) {
                    res.status(400).json({ error: "Share amount cannot be negative" });
                    return;
                }
                sumCents += Math.round(shareAmt * 100);
                finalShares.push({ userId: s.userId, amount: new library_1.Decimal(shareAmt) });
                seen.add(s.userId);
            }
            if (finalShares.length !== participantIds.length ||
                sumCents !== totalCents) {
                res
                    .status(400)
                    .json({
                    error: "Sum of shares must equal total amount and include all participants",
                });
                return;
            }
        }
        else {
            // Equal split in cents across participants
            const n = participantIds.length;
            const base = Math.floor(totalCents / n);
            let remainder = totalCents % n;
            finalShares = participantIds
                .slice()
                .sort()
                .map((uid, idx) => {
                const cents = base + (idx < remainder ? 1 : 0);
                return { userId: uid, amount: new library_1.Decimal(cents).div(100) };
            });
        }
        // Create expense then shares atomically
        const created = await client_1.default.$transaction(async (tx) => {
            const exp = await tx.expense.create({
                data: {
                    amount: new library_1.Decimal(amount),
                    description: description.trim(),
                    date: date ? new Date(date) : new Date(),
                    groupId: parseInt(groupId),
                    paidById: req.user.id,
                    categoryId: categoryId ? parseInt(categoryId) : null,
                },
                include: {
                    category: {
                        select: { id: true, name: true, icon: true, color: true },
                    },
                },
            });
            await tx.expenseShare.createMany({
                data: finalShares.map((s) => ({
                    expenseId: exp.id,
                    userId: s.userId,
                    amount: s.amount,
                })),
                skipDuplicates: true,
            });
            return exp;
        });
        res.status(201).json(created);
    }
    catch (err) {
        console.error("Failed to create expense:", err);
        res.status(500).json({ error: "Failed to create expense" });
    }
};
exports.createExpense = createExpense;
const getExpensesByGroup = async (req, res) => {
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
        const groupMember = await client_1.default.groupMember.findFirst({
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
        const expenses = await client_1.default.expense.findMany({
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
        const expenseIds = expenses.map((e) => e.id);
        const allShares = expenseIds.length
            ? await client_1.default.expenseShare.findMany({
                where: { expenseId: { in: expenseIds } },
                select: { expenseId: true, userId: true, amount: true },
            })
            : [];
        // Members for fallback equal split
        const groupMembers = await client_1.default.groupMember.findMany({
            where: { groupId: parseInt(groupId) },
            select: { userId: true },
            orderBy: { userId: "asc" },
        });
        const byExpenseId = {};
        for (const s of allShares) {
            if (!byExpenseId[s.expenseId])
                byExpenseId[s.expenseId] = [];
            byExpenseId[s.expenseId].push({
                userId: s.userId,
                amount: String(s.amount),
            });
        }
        const withPaidByAndShares = await Promise.all(expenses.map(async (expense) => {
            const paidByMember = await client_1.default.groupMember.findFirst({
                where: { groupId: parseInt(groupId), userId: expense.paidById },
                select: { email: true, name: true },
            });
            let sharesForExpense = byExpenseId[expense.id];
            if (!sharesForExpense || sharesForExpense.length === 0) {
                // Derive equal split for legacy expenses for display
                const totalCents = Math.round(Number(expense.amount) * 100);
                const ids = groupMembers.map((m) => m.userId);
                const n = Math.max(1, ids.length);
                const base = Math.floor(totalCents / n);
                let rem = totalCents % n;
                sharesForExpense = ids.map((uid, idx) => ({
                    userId: uid,
                    amount: ((base + (idx < rem ? 1 : 0)) / 100).toFixed(2),
                }));
            }
            return { ...expense, paidBy: paidByMember, shares: sharesForExpense };
        }));
        res.status(200).json(withPaidByAndShares);
    }
    catch (err) {
        console.error("Failed to fetch expenses:", err);
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
};
exports.getExpensesByGroup = getExpensesByGroup;
const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { amount, description, date, categoryId, participants, shares } = req.body;
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        // Get the expense and verify user owns it
        const expense = await client_1.default.expense.findFirst({
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
        // Update expense and optionally replace shares in a transaction
        const updatedExpense = await client_1.default.$transaction(async (tx) => {
            const exp = await tx.expense.update({
                where: { id: parseInt(id) },
                data: {
                    ...(amount && { amount: new library_1.Decimal(amount) }),
                    ...(description && { description: description.trim() }),
                    ...(date && { date: new Date(date) }),
                    ...(categoryId !== undefined && {
                        categoryId: categoryId ? parseInt(categoryId) : null,
                    }),
                },
                include: {
                    category: {
                        select: { id: true, name: true, icon: true, color: true },
                    },
                },
            });
            const groupId = exp.groupId;
            const allMembers = await tx.groupMember.findMany({
                where: { groupId },
                select: { userId: true },
                orderBy: { userId: "asc" },
            });
            const groupMemberIds = new Set(allMembers.map((m) => m.userId));
            // Decide participants for update
            let participantIds = undefined;
            if (Array.isArray(participants) && participants.length > 0) {
                participantIds = Array.from(new Set(participants));
                for (const uid of participantIds) {
                    if (!groupMemberIds.has(uid)) {
                        throw new Error("Participants must be group members");
                    }
                }
            }
            // Build shares if provided, else if amount changed and existing shares exist, re-equalize across current share participants
            let newShares = undefined;
            if (Array.isArray(shares) && shares.length > 0) {
                const provided = shares;
                const seen = new Set();
                let sum = 0;
                const ids = participantIds ?? provided.map((s) => s.userId);
                for (const s of provided) {
                    if (!ids.includes(s.userId) ||
                        seen.has(s.userId) ||
                        !groupMemberIds.has(s.userId)) {
                        throw new Error("Invalid shares list");
                    }
                    const amt = typeof s.amount === "string"
                        ? parseFloat(s.amount)
                        : Number(s.amount || 0);
                    if (amt < 0)
                        throw new Error("Share amount cannot be negative");
                    sum += Math.round(amt * 100);
                }
                const totalCents = Math.round(Number((amount ?? exp.amount)) * 100);
                if (sum !== totalCents)
                    throw new Error("Sum of shares must equal total amount");
                newShares = provided.map((s) => ({
                    userId: s.userId,
                    amount: new library_1.Decimal(typeof s.amount === "string" ? s.amount : Number(s.amount || 0)),
                }));
            }
            else if (amount !== undefined) {
                // Re-equalize using either provided participants or existing share participants
                const existing = await tx.expenseShare.findMany({
                    where: { expenseId: exp.id },
                    select: { userId: true },
                });
                const ids = participantIds ??
                    (existing.length
                        ? existing.map((s) => s.userId)
                        : allMembers.map((m) => m.userId));
                const totalCents = Math.round(Number(amount) * 100);
                const n = Math.max(1, ids.length);
                const base = Math.floor(totalCents / n);
                let rem = totalCents % n;
                newShares = ids
                    .slice()
                    .sort()
                    .map((uid, idx) => ({
                    userId: uid,
                    amount: new library_1.Decimal((base + (idx < rem ? 1 : 0)) / 100),
                }));
            }
            else if (participantIds) {
                // Participants changed without amount: re-equalize with current total
                const totalCents = Math.round(Number(exp.amount) * 100);
                const ids = participantIds;
                const n = Math.max(1, ids.length);
                const base = Math.floor(totalCents / n);
                let rem = totalCents % n;
                newShares = ids
                    .slice()
                    .sort()
                    .map((uid, idx) => ({
                    userId: uid,
                    amount: new library_1.Decimal((base + (idx < rem ? 1 : 0)) / 100),
                }));
            }
            if (newShares) {
                await tx.expenseShare.deleteMany({
                    where: { expenseId: exp.id },
                });
                await tx.expenseShare.createMany({
                    data: newShares.map((s) => ({
                        expenseId: exp.id,
                        userId: s.userId,
                        amount: s.amount,
                    })),
                });
            }
            return exp;
        });
        res.status(200).json(updatedExpense);
    }
    catch (err) {
        console.error("Failed to update expense:", err);
        res.status(500).json({ error: "Failed to update expense" });
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async (req, res) => {
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
        const expense = await client_1.default.expense.findFirst({
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
        await client_1.default.expense.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json({ message: "Expense deleted successfully" });
    }
    catch (err) {
        console.error("Failed to delete expense:", err);
        res.status(500).json({ error: "Failed to delete expense" });
    }
};
exports.deleteExpense = deleteExpense;
const getCategories = async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        // Get all available categories
        const categories = await client_1.default.category.findMany({
            orderBy: { name: "asc" },
        });
        res.status(200).json(categories);
    }
    catch (err) {
        console.error("Failed to fetch categories:", err);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};
exports.getCategories = getCategories;
const getGroupSummary = async (req, res) => {
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
        const groupMember = await client_1.default.groupMember.findFirst({
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
        const totalExpenses = await client_1.default.expense.aggregate({
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
        const expensesByCategory = await client_1.default.expense.groupBy({
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
        const categoryDetails = await Promise.all(expensesByCategory.map(async (item) => {
            const category = item.categoryId
                ? await client_1.default.category.findUnique({
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
        }));
        // Get expenses by member
        const expensesByMember = await client_1.default.expense.groupBy({
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
        const memberDetails = await Promise.all(expensesByMember.map(async (item) => {
            const member = await client_1.default.groupMember.findFirst({
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
        }));
        const summary = {
            total: {
                amount: totalExpenses._sum.amount || 0,
                expenseCount: totalExpenses._count || 0,
            },
            byCategory: categoryDetails,
            byMember: memberDetails,
        };
        res.status(200).json(summary);
    }
    catch (err) {
        console.error("Failed to fetch group summary:", err);
        res.status(500).json({ error: "Failed to fetch group summary" });
    }
};
exports.getGroupSummary = getGroupSummary;
