import { Request, Response } from "express";
import prisma from "../prisma/client";
import { NotificationType } from "@prisma/client";

export const getNotifications = async (
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
    const { limit = 50, offset = 0, unreadOnly = false } = req.query;

    const whereClause: any = {
      userId: req.user.id,
    };

    if (unreadOnly === "true") {
      whereClause.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
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
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationAsRead = async (
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
    // Verify the notification belongs to the user
    const notification = await prisma.notification.findFirst({
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

    const updatedNotification = await prisma.notification.update({
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
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

export const markAllNotificationsAsRead = async (
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
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Failed to mark all notifications as read:", err);
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

export const getUnreadNotificationCount = async (
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
    const count = await prisma.notification.count({
      where: {
        userId: req.user.id,
        isRead: false,
      },
    });

    res.status(200).json({ count });
  } catch (err) {
    console.error("Failed to get unread notification count:", err);
    res.status(500).json({ error: "Failed to get notification count" });
  }
};

// Helper function to create notifications (used by other controllers)
export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  groupId?: number,
  metadata?: any
) => {
  try {
    const notification = await prisma.notification.create({
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
  } catch (err) {
    console.error("Failed to create notification:", err);
    throw new Error("Failed to create notification");
  }
};
