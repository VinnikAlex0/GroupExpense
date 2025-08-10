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
    <Container size="md" py="xl" className="pb-24 sm:pb-0">
      {/* Page Header */}
      <div className="mb-6">
        <Title order={2} className="text-gray-800">
          Your Groups
        </Title>
        <Button onClick={() => setModalOpened(true)} className="hidden sm:inline-flex mt-8" radius="md" size="md" variant="filled">
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

      {/* Mobile fixed primary CTA */}
      <div className="fixed bottom-4 left-0 right-0 px-4 sm:hidden z-50">
        <Button className="w-full" radius="md" size="md" variant="filled" onClick={() => setModalOpened(true)}>
          + Create Group
        </Button>
      </div>
    </Container>
  );
};

export default GroupsPage;
