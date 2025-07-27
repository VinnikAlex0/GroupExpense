import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title, Button } from "@mantine/core";
import { useGroups } from "../hooks/useGroups";
import { Group as GroupType, CreateGroupData } from "../services/groupService";
import {
  GroupList,
  CreateGroupModal,
  ErrorAlert,
  LoadingSpinner,
} from "../components";

const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { groups, loading, error, creating, fetchGroups, createGroup } =
    useGroups();
  const [modalOpened, setModalOpened] = useState(false);

  const handleGroupClick = (group: GroupType) => {
    navigate(`/groups/${group.id}`);
  };

  return (
    <Container size="md" py="xl">
      {/* Page Header */}
      <div className="mb-6">
        <Title order={2} className="text-gray-800">
          Your Groups
        </Title>
        <Button
          onClick={() => setModalOpened(true)}
          className="bg-blue-600 hover:bg-blue-700 mt-8"
        >
          + Create Group
        </Button>
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
  );
};

export default GroupsPage;
