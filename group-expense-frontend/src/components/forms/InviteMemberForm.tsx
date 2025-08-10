import React from "react";
import { Stack, TextInput, Select, Text, Alert } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconMail, IconInfoCircle } from "@tabler/icons-react";
import { Role } from "../../services/groupService";

interface InviteMemberFormProps {
  form: UseFormReturnType<{ email: string; role: Role }>;
  disabled?: boolean;
}

export const InviteMemberForm: React.FC<InviteMemberFormProps> = ({
  form,
  disabled = false,
}) => {
  const roleOptions = [
    { value: Role.MEMBER, label: "Member" },
    { value: Role.ADMIN, label: "Admin" },
  ];

  return (
    <Stack gap="md">
      <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
        <Text size="sm">
          When you invite someone, they'll be automatically added to the group.
          If they have an account, they'll receive a notification.
        </Text>
      </Alert>

      <TextInput
        label="Email Address"
        placeholder="Enter member's email"
        required
        leftSection={<IconMail size={16} />}
        size="md"
        radius="md"
        {...form.getInputProps("email")}
        disabled={disabled}
      />

      <Select
        label="Role"
        data={roleOptions}
        size="md"
        radius="md"
        {...form.getInputProps("role")}
        disabled={disabled}
      />

      <Text size="sm" c="dimmed">
        <strong>Member:</strong> Can view the group and add expenses
        <br />
        <strong>Admin:</strong> Can also invite and manage other members
      </Text>

      <div />
    </Stack>
  );
};
