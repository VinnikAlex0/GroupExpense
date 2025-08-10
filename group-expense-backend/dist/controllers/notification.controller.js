"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.getUnreadNotificationCount = exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.getNotifications = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const getNotifications = async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        const { limit = 50, offset = 0, unreadOnly = false } = req.query;
        const whereClause = {
            userId: req.user.id,
        };
        if (unreadOnly === "true") {
            whereClause.isRead = false;
        }
        const notifications = await client_1.default.notification.findMany({
            where: whereClause,
            include: {
                group: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: parseInt(limit),
            skip: parseInt(offset),
        });
        res.status(200).json(notifications);
    }
    catch (err) {
        console.error("Failed to fetch notifications:", err);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};
exports.getNotifications = getNotifications;
const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        // Verify the notification belongs to the user
        const notification = await client_1.default.notification.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.id,
            },
        });
        if (!notification) {
            res.status(404).json({
                error: "Notification not found",
            });
            return;
        }
        const updatedNotification = await client_1.default.notification.update({
            where: { id: parseInt(id) },
            data: { isRead: true },
            include: {
                group: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        res.status(200).json(updatedNotification);
    }
    catch (err) {
        console.error("Failed to mark notification as read:", err);
        res.status(500).json({ error: "Failed to update notification" });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
const markAllNotificationsAsRead = async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        await client_1.default.notification.updateMany({
            where: {
                userId: req.user.id,
                isRead: false,
            },
            data: { isRead: true },
        });
        res.status(200).json({ message: "All notifications marked as read" });
    }
    catch (err) {
        console.error("Failed to mark all notifications as read:", err);
        res.status(500).json({ error: "Failed to update notifications" });
    }
};
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
const getUnreadNotificationCount = async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        const count = await client_1.default.notification.count({
            where: {
                userId: req.user.id,
                isRead: false,
            },
        });
        res.status(200).json({ count });
    }
    catch (err) {
        console.error("Failed to get unread notification count:", err);
        res.status(500).json({ error: "Failed to get notification count" });
    }
};
exports.getUnreadNotificationCount = getUnreadNotificationCount;
// Helper function to create notifications (used by other controllers)
const createNotification = async (userId, type, title, message, groupId, metadata) => {
    try {
        const notification = await client_1.default.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                groupId,
                metadata,
            },
            include: {
                group: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return notification;
    }
    catch (err) {
        console.error("Failed to create notification:", err);
        throw new Error("Failed to create notification");
    }
};
exports.createNotification = createNotification;
