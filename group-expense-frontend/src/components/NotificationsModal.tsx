import React from "react";
import {
  Modal,
  Stack,
  Group,
  Text,
  Button,
  Card,
  Badge,
  ActionIcon,
  ScrollArea,
  Center,
  Divider,
} from "@mantine/core";
import { IconCheck, IconBell, IconUsers, IconX } from "@tabler/icons-react";
import { Notification } from "../services/notificationService";

interface NotificationsModalProps {
  opened: boolean;
  onClose: () => void;
  notifications: Notification[];
  loading?: boolean;
  onMarkAsRead: (notificationId: number) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  opened,
  onClose,
  notifications,
  loading = false,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const hasUnread = unreadNotifications.length > 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "GROUP_INVITATION":
        return <IconUsers size={16} />;
      default:
        return <IconBell size={16} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "GROUP_INVITATION":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Notifications"
      size="md"
      centered
    >
      <Stack gap="md">
        {/* Header with actions */}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {notifications.length === 0
              ? "No notifications"
              : `${notifications.length} total, ${unreadNotifications.length} unread`}
          </Text>
          {hasUnread && (
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconCheck size={14} />}
              onClick={onMarkAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </Group>

        <Divider />

        {/* Notifications list */}
        <ScrollArea.Autosize mah={400}>
          <Stack gap="xs">
            {notifications.length === 0 ? (
              <Center p="xl">
                <Stack align="center" gap="sm">
                  <IconBell size={48} color="gray" />
                  <Text c="dimmed" ta="center">
                    No notifications yet
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    You'll see notifications here when you're invited to groups
                    or when expenses are added.
                  </Text>
                </Stack>
              </Center>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  withBorder
                  p="md"
                  bg={notification.isRead ? undefined : "blue.0"}
                  className={notification.isRead ? "opacity-70" : ""}
                >
                  <Group align="flex-start" gap="sm">
                    <Badge
                      color={getNotificationColor(notification.type)}
                      variant="light"
                      leftSection={getNotificationIcon(notification.type)}
                      size="sm"
                    >
                      {notification.type.replace("_", " ").toLowerCase()}
                    </Badge>

                    <div className="flex-1">
                      <Group justify="space-between" align="flex-start">
                        <div>
                          <Text fw={notification.isRead ? 400 : 500} size="sm">
                            {notification.title}
                          </Text>
                          <Text size="xs" c="dimmed" mt={2}>
                            {notification.message}
                          </Text>
                          {notification.groupName && (
                            <Badge size="xs" variant="outline" mt={4}>
                              {notification.groupName}
                            </Badge>
                          )}
                        </div>

                        <Group gap={4}>
                          <Text size="xs" c="dimmed">
                            {formatDate(notification.createdAt)}
                          </Text>
                          {!notification.isRead && (
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              onClick={() => onMarkAsRead(notification.id)}
                            >
                              <IconCheck size={14} />
                            </ActionIcon>
                          )}
                        </Group>
                      </Group>
                    </div>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
        </ScrollArea.Autosize>
      </Stack>
    </Modal>
  );
};
