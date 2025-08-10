import React from "react";
import { Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { CreateGroupData } from "../services/groupService";
import { ResponsiveSheet } from "./responsive/ResponsiveSheet";
import { CreateGroupForm } from "./forms/CreateGroupForm";
import { createGroupFormValidate } from "./validation/createGroup.validation";

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
    validate: createGroupFormValidate,
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
        size="md"
        loading={loading}
      >
        Create Group
      </Button>
      <Button
        className="w-full"
        radius="md"
        variant="subtle"
        size="md"
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
        <CreateGroupForm form={form} />
      </form>
    </ResponsiveSheet>
  );
};
