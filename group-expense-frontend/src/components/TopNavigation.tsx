import React from "react";
import { Text, Menu, Avatar, UnstyledButton } from "@mantine/core";
import { IconSettings, IconLogout } from "@tabler/icons-react";
// import { IconBell } from "@tabler/icons-react";
import { useAuth } from "../contexts/AuthContext";
// SessionStatus removed per mobile/UX simplification
import { useNotifications } from "../hooks/useNotifications";
import { NotificationsDropdown } from "./NotificationsDropdown";

interface TopNavigationProps {
  title?: string;
  // Future extensibility props
  children?: React.ReactNode; // For tabs, additional nav items
  leftSection?: React.ReactNode; // For back buttons, menu toggles, etc.
  rightSection?: React.ReactNode; // For custom right-side content
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  title = "GroupExpense",
  children,
  leftSection,
  rightSection,
}) => {
  const { user, signOut } = useAuth();
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get user email for display
  const userEmail = user?.email || "User";
  const userInitials = userEmail
    .split("@")[0]
    .split(".")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Custom Content and Logo/Title */}
          <div className="flex items-center space-x-3">
            {leftSection}
            <Text size="xl" fw={600} className="text-gray-800">
              {title}
            </Text>
          </div>

          {/* Center Section - Navigation Items (Future: Tabs, etc.) */}
          <div className="flex-1 flex justify-center">{children}</div>

          {/* Right Section - Custom Content and User Menu */}
          <div className="flex items-center space-x-4">
            {/* SessionStatus removed */}

            {/* Custom right section content */}
            {rightSection}

            {/* Notifications Dropdown */}
            <NotificationsDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              loading={notificationsLoading}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />

            {/* Account menu: desktop popover, mobile tray-like Drawer */}
            <Menu shadow="md" width={320} position="bottom-end">
              <Menu.Target>
                <UnstyledButton className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar color="blue" radius="xl" size={32}>
                    {userInitials}
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <Text size="sm" fw={500} className="text-gray-700">
                      {userEmail.split("@")[0]}
                    </Text>
                    <Text size="xs" className="text-gray-500">
                      {user?.email}
                    </Text>
                  </div>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown className="p-3 sm:p-2">
                <Menu.Label className="text-base sm:text-sm">
                  Account
                </Menu.Label>
                <Menu.Item
                  className="py-3 sm:py-2 text-base sm:text-sm rounded-md"
                  leftSection={<IconSettings size={16} />}
                >
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  className="py-3 sm:py-2 text-base sm:text-sm rounded-md"
                  color="red"
                  leftSection={<IconLogout size={16} color="#e03131" />}
                  onClick={handleLogout}
                >
                  Sign Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};
