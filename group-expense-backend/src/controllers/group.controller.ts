import { Request, Response } from "express";
import prisma from "../prisma/client";
import { Role } from "@prisma/client";

export const createGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const newGroup = await prisma.group.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        members: {
          create: {
            userId: req.user.id,
            email: req.user.email,
            role: Role.OWNER,
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
  } catch (err) {
    console.error("Failed to create group:", err);
    res.status(500).json({ error: "Failed to create group" });
  }
};

export const getGroups = async (req: Request, res: Response): Promise<void> => {
  // Ensure user is authenticated
  if (!req.user) {
    res.status(401).json({
      error: "User authentication required",
    });
    return;
  }

  try {
    // Get all groups where the user is a member
    const groups = await prisma.group.findMany({
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
      const userMembership = group.members.find(
        (member) => member.userId === req.user!.id
      );
      return {
        ...group,
        userRole: userMembership?.role,
      };
    });

    res.status(200).json(groupsWithUserRole);
  } catch (err) {
    console.error("Failed to fetch groups:", err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

export const getGroupById = async (
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
    const group = await prisma.group.findFirst({
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
    const userMembership = group.members.find(
      (member) => member.userId === req.user!.id
    );

    const groupWithUserRole = {
      ...group,
      userRole: userMembership?.role,
    };

    res.status(200).json(groupWithUserRole);
  } catch (err) {
    console.error("Failed to fetch group:", err);
    res.status(500).json({ error: "Failed to fetch group" });
  }
};

export const addGroupMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { email, role = Role.MEMBER } = req.body;

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
    const userMembership = await prisma.groupMember.findFirst({
      where: {
        groupId: parseInt(id),
        userId: req.user.id,
        role: {
          in: [Role.OWNER, Role.ADMIN],
        },
      },
    });

    if (!userMembership) {
      res.status(403).json({
        error: "Insufficient permissions to add members",
      });
      return;
    }

    // For now, we'll add the member directly by email
    // In a full implementation, you'd send an invitation
    const newMember = await prisma.groupMember.create({
      data: {
        groupId: parseInt(id),
        userId: `temp_${Date.now()}_${email}`, // Temporary user ID
        email: email.trim(),
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

    res.status(201).json(newMember);
  } catch (err: any) {
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

export const updateGroupMember = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const userMembership = await prisma.groupMember.findFirst({
      where: {
        groupId: parseInt(id),
        userId: req.user.id,
        role: {
          in: [Role.OWNER, Role.ADMIN],
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
    const updatedMember = await prisma.groupMember.update({
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
  } catch (err) {
    console.error("Failed to update group member:", err);
    res.status(500).json({ error: "Failed to update group member" });
  }
};

export const removeGroupMember = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const userMembership = await prisma.groupMember.findFirst({
      where: {
        groupId: parseInt(id),
        userId: req.user.id,
        role: {
          in: [Role.OWNER, Role.ADMIN],
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
    await prisma.groupMember.delete({
      where: {
        id: parseInt(memberId),
        groupId: parseInt(id),
      },
    });

    res.status(200).json({ message: "Member removed successfully" });
  } catch (err) {
    console.error("Failed to remove group member:", err);
    res.status(500).json({ error: "Failed to remove group member" });
  }
};

export const deleteGroup = async (
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
    // Check if user is the owner of the group
    const userMembership = await prisma.groupMember.findFirst({
      where: {
        groupId: parseInt(id),
        userId: req.user.id,
        role: Role.OWNER,
      },
    });

    if (!userMembership) {
      res.status(403).json({
        error: "Only group owners can delete groups",
      });
      return;
    }

    // Delete the group (cascades to members and expenses)
    await prisma.group.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error("Failed to delete group:", err);
    res.status(500).json({ error: "Failed to delete group" });
  }
};
