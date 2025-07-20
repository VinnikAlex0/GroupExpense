import React from "react";
import { Card, Text } from "@mantine/core";
import { Group } from "../services/groupService";

interface GroupCardProps {
  group: Group;
  onClick?: (group: Group) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  const handleClick = () => {
    onClick?.(group);
  };

  return (
    <Card
      shadow="sm"
      radius="md"
      p="lg"
      withBorder
      className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <Text fw={500} className="text-lg mb-2">
        {group.name}
      </Text>
      <Text size="sm" c="dimmed" className="mb-1">
        Created by: {group.createdBy}
      </Text>
      <Text size="xs" className="text-gray-500">
        {new Date(group.createdAt).toLocaleString()}
      </Text>
    </Card>
  );
};
