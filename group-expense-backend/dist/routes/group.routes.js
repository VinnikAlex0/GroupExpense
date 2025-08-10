"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_controller_1 = require("../controllers/group.controller");
const expense_controller_1 = require("../controllers/expense.controller");
const notification_controller_1 = require("../controllers/notification.controller");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Group routes
router.post("/groups", auth_middleware_1.authenticateUser, group_controller_1.createGroup);
router.get("/groups", auth_middleware_1.authenticateUser, group_controller_1.getGroups);
router.get("/groups/:id", auth_middleware_1.authenticateUser, group_controller_1.getGroupById);
router.delete("/groups/:id", auth_middleware_1.authenticateUser, group_controller_1.deleteGroup);
// Group member routes
router.post("/groups/:id/members", auth_middleware_1.authenticateUser, group_controller_1.addGroupMember);
router.put("/groups/:id/members/:memberId", auth_middleware_1.authenticateUser, group_controller_1.updateGroupMember);
router.delete("/groups/:id/members/:memberId", auth_middleware_1.authenticateUser, group_controller_1.removeGroupMember);
// Expense routes
router.post("/expenses", auth_middleware_1.authenticateUser, expense_controller_1.createExpense);
router.get("/groups/:groupId/expenses", auth_middleware_1.authenticateUser, expense_controller_1.getExpensesByGroup);
router.put("/expenses/:id", auth_middleware_1.authenticateUser, expense_controller_1.updateExpense);
router.delete("/expenses/:id", auth_middleware_1.authenticateUser, expense_controller_1.deleteExpense);
// Group summary route
router.get("/groups/:groupId/summary", auth_middleware_1.authenticateUser, expense_controller_1.getGroupSummary);
// Category routes
router.get("/categories", auth_middleware_1.authenticateUser, expense_controller_1.getCategories);
// Notification routes
router.get("/notifications", auth_middleware_1.authenticateUser, notification_controller_1.getNotifications);
router.get("/notifications/unread-count", auth_middleware_1.authenticateUser, notification_controller_1.getUnreadNotificationCount);
router.put("/notifications/:id/read", auth_middleware_1.authenticateUser, notification_controller_1.markNotificationAsRead);
router.put("/notifications/mark-all-read", auth_middleware_1.authenticateUser, notification_controller_1.markAllNotificationsAsRead);
// User routes
router.post("/user/migrate-pending", auth_middleware_1.authenticateUser, user_controller_1.migratePendingMemberships);
router.get("/user/profile", auth_middleware_1.authenticateUser, user_controller_1.getUserProfile);
exports.default = router;
