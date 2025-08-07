import React from "react";
import {
  Menu,
  Text,
  Group,
  Badge,
  ActionIcon,
  Stack,
  Card,
  Button,
  ScrollArea,
  Center,
  Divider,
  Indicator,
} from "@mantine/core";
import { IconBell, IconUsers, IconCheck } from "@tabler/icons-react";
import { Notification } from "../services/notificationService";

interface NotificationsDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  loading?: boolean;
  onMarkAsRead: (notificationId: number) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  unreadCount,
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
        return <IconUsers size={14} />;
      default:
        return <IconBell size={14} />;
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

  const handleNotificationHover = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await onMarkAsRead(notification.id);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  return (
    <Menu shadow="md" width={400} position="bottom-end">
      <Menu.Target>
        <Indicator
          label={unreadCount}
          size={16}
          disabled={unreadCount === 0}
          color="red"
        >
          <ActionIcon
            variant="subtle"
            size="lg"
            className="text-gray-600 hover:text-gray-800"
          >
            <IconBell size={20} />
          </ActionIcon>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Group justify="space-between" align="center">
            <Text size="sm" fw={500}>
              Notifications
            </Text>
            {hasUnread && (
              <Button
                variant="subtle"
                size="xs"
                leftSection={<IconCheck size={12} />}
                onClick={onMarkAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </Group>
        </Menu.Label>

        <Divider />

        <ScrollArea.Autosize mah={300}>
          <Stack gap="xs" p="xs">
            {notifications.length === 0 ? (
              <Center p="md">
                <Stack align="center" gap="sm">
                  <IconBell size={32} color="gray" />
                  <Text size="sm" c="dimmed" ta="center">
                    No notifications yet
                  </Text>
                </Stack>
              </Center>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  withBorder
                  p="sm"
                  bg={notification.isRead ? undefined : "blue.0"}
                  className={`transition-all duration-200 hover:shadow-sm ${
                    notification.isRead ? "opacity-70" : ""
                  }`}
                  onMouseEnter={() => handleNotificationHover(notification)}
                >
                  <Group align="flex-start" gap="sm">
                    <Badge
                      color={getNotificationColor(notification.type)}
                      variant="light"
                      size="xs"
                      leftSection={getNotificationIcon(notification.type)}
                    >
                      {notification.type.replace("_", " ").toLowerCase()}
                    </Badge>

                    <div className="flex-1 min-w-0">
                      <Text
                        size="sm"
                        fw={notification.isRead ? 400 : 500}
                        lineClamp={2}
                      >
                        {notification.title}
                      </Text>
                      <Text size="xs" c="dimmed" mt={2} lineClamp={1}>
                        {notification.message}
                      </Text>
                      {notification.groupName && (
                        <Badge size="xs" variant="outline" mt={4}>
                          {notification.groupName}
                        </Badge>
                      )}
                    </div>

                    <Text size="xs" c="dimmed" className="whitespace-nowrap">
                      {formatDate(notification.createdAt)}
                    </Text>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
        </ScrollArea.Autosize>

        {notifications.length > 0 && (
          <>
            <Divider />
            <Menu.Item component="div" className="text-center" disabled>
              <Text size="xs" c="dimmed">
                {notifications.length} total, {unreadNotifications.length}{" "}
                unread
              </Text>
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
