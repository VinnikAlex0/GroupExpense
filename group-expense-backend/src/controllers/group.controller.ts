import { Request, Response } from "express";
import prisma from "../prisma/client";

export const createGroup = async (req: Request, res: Response) => {
  const { name } = req.body;

  // Validate required fields
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      error: "Group name is required and must be a non-empty string",
    });
  }

  // Ensure user is authenticated (middleware should have set this)
  if (!req.user) {
    return res.status(401).json({
      error: "User authentication required",
    });
  }

  try {
    const newGroup = await prisma.group.create({
      data: {
        name: name.trim(),
        createdBy: req.user.email, // Use authenticated user's email
        userId: req.user.id, // Store user ID for relationships
      },
    });

    res.status(201).json(newGroup);
  } catch (err) {
    console.error("Failed to create group:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroups = async (req: Request, res: Response) => {
  // Ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({
      error: "User authentication required",
    });
  }

  try {
    // Get only groups created by the authenticated user
    const groups = await prisma.group.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(groups);
  } catch (err) {
    console.error("Failed to fetch groups:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
