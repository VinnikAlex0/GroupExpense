import { Router } from "express";
import {
  createGroup,
  getGroups,
  getGroupById,
  addGroupMember,
  updateGroupMember,
  removeGroupMember,
  deleteGroup,
} from "../controllers/group.controller";
import {
  createExpense,
  getExpensesByGroup,
  updateExpense,
  deleteExpense,
  getCategories,
  getGroupSummary,
} from "../controllers/expense.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

// Group routes
router.post("/groups", authenticateUser, createGroup);
router.get("/groups", authenticateUser, getGroups);
router.get("/groups/:id", authenticateUser, getGroupById);
router.delete("/groups/:id", authenticateUser, deleteGroup);

// Group member routes
router.post("/groups/:id/members", authenticateUser, addGroupMember);
router.put(
  "/groups/:id/members/:memberId",
  authenticateUser,
  updateGroupMember
);
router.delete(
  "/groups/:id/members/:memberId",
  authenticateUser,
  removeGroupMember
);

// Expense routes
router.post("/expenses", authenticateUser, createExpense);
router.get("/groups/:groupId/expenses", authenticateUser, getExpensesByGroup);
router.put("/expenses/:id", authenticateUser, updateExpense);
router.delete("/expenses/:id", authenticateUser, deleteExpense);

// Group summary route
router.get("/groups/:groupId/summary", authenticateUser, getGroupSummary);

// Category routes
router.get("/categories", authenticateUser, getCategories);

export default router;
