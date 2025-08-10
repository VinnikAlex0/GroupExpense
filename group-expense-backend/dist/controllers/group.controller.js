"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroup = exports.removeGroupMember = exports.updateGroupMember = exports.addGroupMember = exports.getGroupById = exports.getGroups = exports.createGroup = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const client_2 = require("@prisma/client");
const supabase_1 = require("../lib/supabase");
const notification_controller_1 = require("./notification.controller");
const createGroup = async (req, res) => {
    const { name, description } = req.body;
    // Validate required fields
    if (!name || typeof name !== "string" || !name.trim()) {
        res.status(400).json({
            error: "Group name is required and must be a non-empty string",
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
        // Create group with the user as the owner
        const newGroup = await client_1.default.group.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                members: {
                    create: {
                        userId: req.user.id,
                        email: req.user.email,
                        role: client_2.Role.OWNER,
                    },
                },
            },
            include: {
                members: {
                    select: {
                        id: true,
                        userId: true,
                        email: true,
                        name: true,
                        role: true,
                        joinedAt: true,
                    },
                },
                _count: {
                    select: {
                        expenses: true,
                    },
                },
            },
        });
        res.status(201).json(newGroup);
    }
    catch (err) {
        console.error("Failed to create group:", err);
        res.status(500).json({ error: "Failed to create group" });
    }
};
exports.createGroup = createGroup;
const getGroups = async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        // Get all groups where the user is a member
        const groups = await client_1.default.group.findMany({
            where: {
                members: {
                    some: {
                        userId: req.user.id,
                    },
                },
            },
            include: {
                members: {
                    select: {
                        id: true,
                        userId: true,
                        email: true,
                        name: true,
                        role: true,
                        joinedAt: true,
                    },
                },
                _count: {
                    select: {
                        expenses: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        // Add user's role in each group to the response
        const groupsWithUserRole = groups.map((group) => {
            const userMembership = group.members.find((member) => member.userId === req.user.id);
            return {
                ...group,
                userRole: userMembership?.role,
            };
        });
        res.status(200).json(groupsWithUserRole);
    }
    catch (err) {
        console.error("Failed to fetch groups:", err);
        res.status(500).json({ error: "Failed to fetch groups" });
    }
};
exports.getGroups = getGroups;
const getGroupById = async (req, res) => {
    const { id } = req.params;
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        const group = await client_1.default.group.findFirst({
            where: {
                id: parseInt(id),
                members: {
                    some: {
                        userId: req.user.id,
                    },
                },
            },
            include: {
                members: {
                    select: {
                        id: true,
                        userId: true,
                        email: true,
                        name: true,
                        role: true,
                        joinedAt: true,
                    },
                },
                expenses: {
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
                },
                _count: {
                    select: {
                        expenses: true,
                    },
                },
            },
        });
        if (!group) {
            res.status(404).json({ error: "Group not found" });
            return;
        }
        // Add user's role in the group
        const userMembership = group.members.find((member) => member.userId === req.user.id);
        const groupWithUserRole = {
            ...group,
            userRole: userMembership?.role,
        };
        res.status(200).json(groupWithUserRole);
    }
    catch (err) {
        console.error("Failed to fetch group:", err);
        res.status(500).json({ error: "Failed to fetch group" });
    }
};
exports.getGroupById = getGroupById;
const addGroupMember = async (req, res) => {
    const { id } = req.params;
    const { email, role = client_2.Role.MEMBER } = req.body;
    // Validate required fields
    if (!email || typeof email !== "string") {
        res.status(400).json({
            error: "Member email is required",
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
        // Check if user has permission to add members (OWNER or ADMIN)
        const userMembership = await client_1.default.groupMember.findFirst({
            where: {
                groupId: parseInt(id),
                userId: req.user.id,
                role: {
                    in: [client_2.Role.OWNER, client_2.Role.ADMIN],
                },
            },
        });
        if (!userMembership) {
            res.status(403).json({
                error: "Insufficient permissions to add members",
            });
            return;
        }
        // Get group information for notification
        const group = await client_1.default.group.findUnique({
            where: { id: parseInt(id) },
            select: { name: true },
        });
        if (!group) {
            res.status(404).json({
                error: "Group not found",
            });
            return;
        }
        // Look up user in Supabase by email
        const { data: supabaseUsers, error: supabaseError } = await supabase_1.supabase.auth.admin.listUsers({
            page: 1,
            perPage: 1000, // Supabase limitation
        });
        if (supabaseError) {
            console.error("Error fetching users from Supabase:", supabaseError);
            res.status(500).json({
                error: "Failed to lookup user",
            });
            return;
        }
        // Find user by email
        const invitedUser = supabaseUsers.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
        let newMember;
        let userId;
        let userName;
        if (invitedUser) {
            // User exists in Supabase, use their real ID
            userId = invitedUser.id;
            userName =
                invitedUser.user_metadata?.name || invitedUser.user_metadata?.full_name;
            // Add member to group
            newMember = await client_1.default.groupMember.create({
                data: {
                    groupId: parseInt(id),
                    userId: userId,
                    email: email.trim().toLowerCase(),
                    name: userName,
                    role: role,
                },
                select: {
                    id: true,
                    userId: true,
                    email: true,
                    name: true,
                    role: true,
                    joinedAt: true,
                },
            });
            // Create notification for the invited user
            await (0, notification_controller_1.createNotification)(userId, client_2.NotificationType.GROUP_INVITATION, "You've been added to a group!", `${req.user.email} added you to "${group.name}"`, parseInt(id), {
                inviterEmail: req.user.email,
                groupName: group.name,
                role: role,
            });
        }
        else {
            // User doesn't exist yet, create with placeholder ID
            // They'll be migrated when they sign up
            userId = `pending_${Date.now()}_${email.toLowerCase()}`;
            newMember = await client_1.default.groupMember.create({
                data: {
                    groupId: parseInt(id),
                    userId: userId,
                    email: email.trim().toLowerCase(),
                    name: null,
                    role: role,
                },
                select: {
                    id: true,
                    userId: true,
                    email: true,
                    name: true,
                    role: true,
                    joinedAt: true,
                },
            });
            // Note: No notification created for non-existent users
            // They'll get notified when they sign up and we migrate their data
        }
        res.status(201).json(newMember);
    }
    catch (err) {
        console.error("Failed to add group member:", err);
        if (err.code === "P2002") {
            res.status(400).json({
                error: "User is already a member of this group",
            });
            return;
        }
        res.status(500).json({ error: "Failed to add group member" });
    }
};
exports.addGroupMember = addGroupMember;
const updateGroupMember = async (req, res) => {
    const { id, memberId } = req.params;
    const { role } = req.body;
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        // Check if user has permission to update members (OWNER or ADMIN)
        const userMembership = await client_1.default.groupMember.findFirst({
            where: {
                groupId: parseInt(id),
                userId: req.user.id,
                role: {
                    in: [client_2.Role.OWNER, client_2.Role.ADMIN],
                },
            },
        });
        if (!userMembership) {
            res.status(403).json({
                error: "Insufficient permissions to update members",
            });
            return;
        }
        // Update the member's role
        const updatedMember = await client_1.default.groupMember.update({
            where: {
                id: parseInt(memberId),
                groupId: parseInt(id),
            },
            data: {
                role: role,
            },
            select: {
                id: true,
                userId: true,
                email: true,
                name: true,
                role: true,
                joinedAt: true,
            },
        });
        res.status(200).json(updatedMember);
    }
    catch (err) {
        console.error("Failed to update group member:", err);
        res.status(500).json({ error: "Failed to update group member" });
    }
};
exports.updateGroupMember = updateGroupMember;
const removeGroupMember = async (req, res) => {
    const { id, memberId } = req.params;
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        // Check if user has permission to remove members (OWNER or ADMIN)
        const userMembership = await client_1.default.groupMember.findFirst({
            where: {
                groupId: parseInt(id),
                userId: req.user.id,
                role: {
                    in: [client_2.Role.OWNER, client_2.Role.ADMIN],
                },
            },
        });
        if (!userMembership) {
            res.status(403).json({
                error: "Insufficient permissions to remove members",
            });
            return;
        }
        // Remove the member
        await client_1.default.groupMember.delete({
            where: {
                id: parseInt(memberId),
                groupId: parseInt(id),
            },
        });
        res.status(200).json({ message: "Member removed successfully" });
    }
    catch (err) {
        console.error("Failed to remove group member:", err);
        res.status(500).json({ error: "Failed to remove group member" });
    }
};
exports.removeGroupMember = removeGroupMember;
const deleteGroup = async (req, res) => {
    const { id } = req.params;
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            error: "User authentication required",
        });
        return;
    }
    try {
        // Check if user is the owner of the group
        const userMembership = await client_1.default.groupMember.findFirst({
            where: {
                groupId: parseInt(id),
                userId: req.user.id,
                role: client_2.Role.OWNER,
            },
        });
        if (!userMembership) {
            res.status(403).json({
                error: "Only group owners can delete groups",
            });
            return;
        }
        // Delete the group (cascades to members and expenses)
        await client_1.default.group.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json({ message: "Group deleted successfully" });
    }
    catch (err) {
        console.error("Failed to delete group:", err);
        res.status(500).json({ error: "Failed to delete group" });
    }
};
exports.deleteGroup = deleteGroup;
