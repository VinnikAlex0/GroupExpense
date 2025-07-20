import React from "react";
import { Modal, TextInput, Stack, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { CreateGroupData } from "../services/groupService";

interface CreateGroupModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGroupData) => Promise<boolean>;
  loading?: boolean;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  opened,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const form = useForm<CreateGroupData>({
    initialValues: {
      name: "",
      createdBy: "",
    },
    validate: {
      name: (value) => {
        if (!value.trim()) return "Group name is required";
        if (value.trim().length < 2)
          return "Group name must be at least 2 characters";
        if (value.trim().length > 100)
          return "Group name must be less than 100 characters";
        return null;
      },
      createdBy: (value) => {
        if (!value.trim()) return "Creator name is required";
        if (value.trim().length < 2)
          return "Creator name must be at least 2 characters";
        if (value.trim().length > 50)
          return "Creator name must be less than 50 characters";
        return null;
      },
    },
  });

  const handleSubmit = async (values: CreateGroupData) => {
    const success = await onSubmit(values);
    if (success) {
      form.reset();
      onClose();
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create New Group"
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Group Name"
            placeholder="Enter group name (e.g., 'Weekend Trip', 'Office Lunch')"
            required
            {...form.getInputProps("name")}
            disabled={loading}
            data-autofocus
          />

          <TextInput
            label="Created By"
            placeholder="Enter your name"
            required
            {...form.getInputProps("createdBy")}
            disabled={loading}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Group
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
