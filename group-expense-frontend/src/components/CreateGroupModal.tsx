import React from "react";
import { Button, TextInput, Textarea, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { CreateGroupData } from "../services/groupService";
import { ResponsiveSheet } from "./responsive/ResponsiveSheet";

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

  const footer = (
    <Stack gap="xs">
      <Button
        type="submit"
        form="create-group-form"
        className="w-full"
        radius="md"
        variant="filled"
        loading={loading}
      >
        Create Group
      </Button>
      <Button
        className="w-full"
        radius="md"
        variant="subtle"
        onClick={handleClose}
        disabled={loading}
      >
        Cancel
      </Button>
    </Stack>
  );

  return (
    <ResponsiveSheet
      opened={opened}
      onClose={handleClose}
      title="Create New Group"
      footer={footer}
    >
      <form id="create-group-form" onSubmit={form.onSubmit(handleSubmit)}>
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

          <div />
        </Stack>
      </form>
    </ResponsiveSheet>
  );
};
