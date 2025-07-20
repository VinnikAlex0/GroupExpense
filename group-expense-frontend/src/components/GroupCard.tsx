import React from "react";
import { Card, Group, Text, Badge, Stack, Avatar } from "@mantine/core";
import { Group as GroupType, Role } from "../services/groupService";

interface GroupCardProps {
  group: GroupType;
  onClick: (group: GroupType) => void;
}

const getRoleBadgeProps = (role: Role) => {
  switch (role) {
    case Role.OWNER:
      return { color: "red", variant: "filled" };
    case Role.ADMIN:
      return { color: "orange", variant: "filled" };
    case Role.MEMBER:
      return { color: "blue", variant: "light" };
    default:
      return { color: "gray", variant: "light" };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  const memberCount = group.members.length;
  const expenseCount = group._count.expenses;
  const userRole = group.userRole;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: "pointer" }}
      onClick={() => onClick(group)}
      className="hover:shadow-md transition-shadow duration-200"
    >
      <Stack gap="sm">
        {/* Header with title and role */}
        <Group justify="space-between" align="flex-start">
          <div className="flex-1">
            <Text fw={600} size="lg" lineClamp={1}>
              {group.name}
            </Text>
            {group.description && (
              <Text size="sm" c="dimmed" lineClamp={2} mt={4}>
                {group.description}
              </Text>
            )}
          </div>
          {userRole && (
            <Badge {...getRoleBadgeProps(userRole)} size="sm">
              {userRole}
            </Badge>
          )}
        </Group>

        {/* Member avatars and count */}
        <Group gap="xs" align="center">
          <Avatar.Group spacing="xs">
            {group.members.slice(0, 3).map((member, index) => (
              <Avatar
                key={member.id}
                size="sm"
                radius="xl"
                name={member.name || member.email}
                color="blue"
              >
                {(member.name || member.email).substring(0, 2).toUpperCase()}
              </Avatar>
            ))}
            {memberCount > 3 && (
              <Avatar size="sm" radius="xl" color="gray">
                +{memberCount - 3}
              </Avatar>
            )}
          </Avatar.Group>
          <Text size="sm" c="dimmed">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </Text>
        </Group>

        {/* Stats and date */}
        <Group justify="space-between" align="center">
          <Group gap="md">
            <div>
              <Text size="sm" c="dimmed">
                Expenses
              </Text>
              <Text fw={500} size="sm">
                {expenseCount}
              </Text>
            </div>
          </Group>
          <Text size="xs" c="dimmed">
            Created {formatDate(group.createdAt)}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};
