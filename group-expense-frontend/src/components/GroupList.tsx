import React from "react";
import { SimpleGrid, Stack, Text, Paper, Center } from "@mantine/core";
import { Group as GroupType } from "../services/groupService";
import { GroupCard } from "./GroupCard";

interface GroupListProps {
  groups: GroupType[];
  loading?: boolean;
  onGroupClick: (group: GroupType) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  loading = false,
  onGroupClick,
}) => {
  if (loading) {
    return (
      <Center h={200}>
        <Text c="dimmed">Loading groups...</Text>
      </Center>
    );
  }

  if (groups.length === 0) {
    return (
      <Paper p="xl" radius="md" withBorder>
        <Stack gap="md" align="center">
          <Text size="lg" fw={500} c="dimmed">
            No groups yet
          </Text>
          <Text size="sm" c="dimmed" ta="center" maw={400}>
            Create your first group to start tracking shared expenses with
            friends, family, or colleagues. You can add members and categorize
            expenses easily.
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3 }}
      spacing="md"
      verticalSpacing="md"
    >
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} onClick={onGroupClick} />
      ))}
    </SimpleGrid>
  );
};
