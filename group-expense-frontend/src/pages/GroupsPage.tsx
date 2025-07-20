import React, { useState } from "react";
import { Container, Title, Button } from "@mantine/core";
import { useGroups } from "../hooks/useGroups";
import { Group as GroupType, CreateGroupData } from "../services/groupService";
import {
  GroupList,
  CreateGroupModal,
  ErrorAlert,
  LoadingSpinner,
  TopNavigation,
} from "../components";

const GroupsPage: React.FC = () => {
  const { groups, loading, error, creating, fetchGroups, createGroup } =
    useGroups();
  const [modalOpened, setModalOpened] = useState(false);

  const handleGroupClick = (group: GroupType) => {
    // TODO: Navigate to group details page
    console.log("Group clicked:", group);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigation
        title="GroupExpense"
        rightSection={
          <Button
            onClick={() => setModalOpened(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            + Create Group
          </Button>
        }
      />

      <Container size="md" py="xl">
        {/* Page Header */}
        <div className="mb-6">
          <Title order={2} className="text-gray-800">
            Your Groups
          </Title>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && <ErrorAlert message={error} onRetry={fetchGroups} />}

        {/* Groups List */}
        <GroupList
          groups={groups}
          loading={loading}
          onGroupClick={handleGroupClick}
        />

        {/* Create Group Modal */}
        <CreateGroupModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          onSubmit={createGroup}
          loading={creating}
        />
      </Container>
    </div>
  );
};

export default GroupsPage;
