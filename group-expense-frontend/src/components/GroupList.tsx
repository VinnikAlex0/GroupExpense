import React from "react";
import { SimpleGrid, Text } from "@mantine/core";
import { Group } from "../services/groupService";
import { GroupCard } from "./GroupCard";

interface GroupListProps {
  groups: Group[];
  loading: boolean;
  onGroupClick?: (group: Group) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  loading,
  onGroupClick,
}) => {
  // Show empty state if not loading and no groups
  if (!loading && groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Text size="lg" c="dimmed">
          No groups found. Create your first group to get started!
        </Text>
      </div>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} onClick={onGroupClick} />
      ))}
    </SimpleGrid>
  );
};
