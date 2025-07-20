import React, { useState } from "react";
import { Container, Title, Button } from "@mantine/core";
import { useGroups } from "../hooks/useGroups";
import { Group, CreateGroupData } from "../services/groupService";
import {
  GroupList,
  CreateGroupModal,
  ErrorAlert,
  LoadingSpinner,
} from "../components";

const GroupsPage: React.FC = () => {
  const { groups, loading, error, creating, fetchGroups, createGroup } =
    useGroups();
  const [modalOpened, setModalOpened] = useState(false);

  const handleGroupClick = (group: Group) => {
    // TODO: Navigate to group details page
    console.log("Group clicked:", group);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container size="md" py="xl">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <Title order={2} className="text-gray-800">
            Group List
          </Title>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && <ErrorAlert message={error} onRetry={fetchGroups} />}

        {/* Create Group Button */}
        <Button
          onClick={() => setModalOpened(true)}
          className="bg-blue-600 hover:bg-blue-700 mb-4"
        >
          + Create Group
        </Button>

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
