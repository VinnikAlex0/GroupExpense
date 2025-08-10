import React from "react";
import { Stack, TextInput, Textarea } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { CreateGroupData } from "../../services/groupService";

interface CreateGroupFormProps {
  form: UseFormReturnType<CreateGroupData>;
}

export const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ form }) => {
  return (
    <Stack gap="md">
      <TextInput
        label="Group Name"
        placeholder="Enter group name"
        required
        size="md"
        radius="md"
        {...form.getInputProps("name")}
      />

      <Textarea
        label="Description"
        placeholder="What's this group for? (optional)"
        minRows={3}
        maxRows={5}
        size="md"
        radius="md"
        {...form.getInputProps("description")}
      />

      <div />
    </Stack>
  );
};
