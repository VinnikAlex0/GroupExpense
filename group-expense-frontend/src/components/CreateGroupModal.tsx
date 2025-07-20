import React from "react";
import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Stack,
  Group,
} from "@mantine/core";
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
      description: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Group name must have at least 2 letters" : null,
    },
  });

  const handleSubmit = async (values: CreateGroupData) => {
    const success = await onSubmit({
      name: values.name,
      description: values.description || undefined,
    });

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
            placeholder="Enter group name"
            required
            {...form.getInputProps("name")}
          />

          <Textarea
            label="Description"
            placeholder="What's this group for? (optional)"
            minRows={3}
            maxRows={5}
            {...form.getInputProps("description")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
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
