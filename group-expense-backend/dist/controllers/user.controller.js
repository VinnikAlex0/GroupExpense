"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.migratePendingMemberships = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const client_2 = require("@prisma/client");
const notification_controller_1 = require("./notification.controller");
/**
 * Migrate pending group memberships when a user signs up
 * This should be called when a new user completes registration
 */
const migratePendingMemberships = async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        // Find all pending memberships for this user's email
        const pendingMemberships = await client_1.default.groupMember.findMany({
            where: {
                email: req.user.email.toLowerCase(),
                userId: {
                    startsWith: "pending_",
                },
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
        if (pendingMemberships.length === 0) {
            res.status(200).json({
                message: "No pending memberships found",
                migratedCount: 0,
            });
            return;
        }
        // Update all pending memberships with the real user ID
        const updatePromises = pendingMemberships.map(async (membership) => {
            // Update the membership
            await client_1.default.groupMember.update({
                where: { id: membership.id },
                data: {
                    userId: req.user.id,
                    name: req.user.email.split("@")[0], // Basic name from email
                },
            });
            // Create notification for the newly signed up user
            await (0, notification_controller_1.createNotification)(req.user.id, client_2.NotificationType.GROUP_INVITATION, "Welcome! You've been added to a group", `You were invited to "${membership.group.name}" and have been automatically added`, membership.group.id, {
                groupName: membership.group.name,
                role: membership.role,
                wasPreInvited: true,
            });
            return membership;
        });
        await Promise.all(updatePromises);
        res.status(200).json({
            message: "Successfully migrated pending memberships",
            migratedCount: pendingMemberships.length,
            groups: pendingMemberships.map((m) => m.group.name),
        });
    }
    catch (err) {
        console.error("Failed to migrate pending memberships:", err);
        res.status(500).json({ error: "Failed to migrate pending memberships" });
    }
};
exports.migratePendingMemberships = migratePendingMemberships;
/**
 * Get user profile information
 */
const getUserProfile = async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        // Get user's group memberships
        const memberships = await client_1.default.groupMember.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                group: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        // Get unread notification count
        const unreadCount = await client_1.default.notification.count({
            where: {
                userId: req.user.id,
                isRead: false,
            },
        });
        res.status(200).json({
            user: {
                id: req.user.id,
                email: req.user.email,
            },
            groupCount: memberships.length,
            unreadNotifications: unreadCount,
            groups: memberships.map((m) => ({
                id: m.group.id,
                name: m.group.name,
                description: m.group.description,
                role: m.role,
                joinedAt: m.joinedAt,
            })),
        });
    }
    catch (err) {
        console.error("Failed to get user profile:", err);
        res.status(500).json({ error: "Failed to get user profile" });
    }
};
exports.getUserProfile = getUserProfile;
