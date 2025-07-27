import React from "react";
import { useNavigate } from "react-router-dom";
import { ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { TopNavigation } from "./TopNavigation";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  backPath?: string;
  rightSection?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = "GroupExpense",
  showBackButton = false,
  backPath = "/groups",
  rightSection,
}) => {
  const navigate = useNavigate();

  const leftSection = showBackButton ? (
    <ActionIcon variant="subtle" onClick={() => navigate(backPath)} size="lg">
      <IconArrowLeft size={20} />
    </ActionIcon>
  ) : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigation
        title={title}
        leftSection={leftSection}
        rightSection={rightSection}
      />

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};
