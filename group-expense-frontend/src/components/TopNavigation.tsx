import React from "react";
import {
  Group,
  Button,
  Text,
  Menu,
  Avatar,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { useAuth } from "../contexts/AuthContext";

interface TopNavigationProps {
  title?: string;
  // Future extensibility props
  children?: React.ReactNode; // For tabs, additional nav items
  rightSection?: React.ReactNode; // For custom right-side content
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  title = "GroupExpense",
  children,
  rightSection,
}) => {
  const { user, signOut } = useAuth();

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
          {/* Left Section - Logo/Title */}
          <div className="flex items-center">
            <Text size="xl" fw={600} className="text-gray-800">
              {title}
            </Text>
          </div>

          {/* Center Section - Navigation Items (Future: Tabs, etc.) */}
          <div className="flex-1 flex justify-center">{children}</div>

          {/* Right Section - User Menu */}
          <div className="flex items-center space-x-4">
            {rightSection}

            <Menu shadow="md" width={200} position="bottom-end">
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

              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>

                <Menu.Item>Profile Settings</Menu.Item>

                <Menu.Item>Notifications</Menu.Item>

                <Menu.Divider />

                <Menu.Item color="red" onClick={handleLogout}>
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
