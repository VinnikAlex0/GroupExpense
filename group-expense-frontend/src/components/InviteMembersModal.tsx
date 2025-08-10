import React, { useState } from "react";
import {
  Button,
  TextInput,
  Select,
  Stack,
  Group,
  Text,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconMail, IconUserPlus, IconInfoCircle } from "@tabler/icons-react";
import { Role } from "../services/groupService";
import { ResponsiveSheet } from "./responsive/ResponsiveSheet";

interface InviteMembersModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (email: string, role: Role) => Promise<boolean>;
  loading?: boolean;
  groupName: string;
}

interface FormValues {
  email: string;
  role: Role;
}

export const InviteMembersModal: React.FC<InviteMembersModalProps> = ({
  opened,
  onClose,
  onSubmit,
  loading = false,
  groupName,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      email: "",
      role: Role.MEMBER,
    },
    validate: {
      email: (value) => {
        if (!value || !value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return "Please enter a valid email address";
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const success = await onSubmit(values.email.trim(), values.role);

      if (success) {
        notifications.show({
          title: "Member Invited!",
          message: `${values.email} has been added to "${groupName}". They'll receive a notification if they have an account.`,
          color: "green",
          icon: <IconUserPlus size={16} />,
        });
        form.reset();
        onClose();
      }
    } catch (error) {
      console.error("Failed to invite member:", error);
      // Error notification will be handled by the parent component
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const roleOptions = [
    { value: Role.MEMBER, label: "Member" },
    { value: Role.ADMIN, label: "Admin" },
  ];

  const footer = (
    <Stack gap="xs">
      <Button
        type="submit"
        form="invite-member-form"
        className="w-full"
        radius="md"
        variant="filled"
        loading={submitting || loading}
        leftSection={<IconUserPlus size={16} />}
      >
        Invite Member
      </Button>
      <Button
        className="w-full"
        radius="md"
        variant="subtle"
        onClick={handleClose}
        disabled={submitting || loading}
      >
        Cancel
      </Button>
    </Stack>
  );

  return (
    <ResponsiveSheet
      opened={opened}
      onClose={handleClose}
      title={`Invite Member to ${groupName}`}
      footer={footer}
    >
      <form id="invite-member-form" onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Alert
            icon={<IconInfoCircle size={16} />}
            color="blue"
            variant="light"
          >
            <Text size="sm">
              When you invite someone, they'll be automatically added to the
              group. If they have an account, they'll receive a notification.
            </Text>
          </Alert>

          <TextInput
            label="Email Address"
            placeholder="Enter member's email"
            required
            leftSection={<IconMail size={16} />}
            {...form.getInputProps("email")}
            disabled={submitting}
          />

          <Select
            label="Role"
            data={roleOptions}
            {...form.getInputProps("role")}
            disabled={submitting}
          />

          <Text size="sm" c="dimmed">
            <strong>Member:</strong> Can view the group and add expenses
            <br />
            <strong>Admin:</strong> Can also invite and manage other members
          </Text>

          <div />
        </Stack>
      </form>
    </ResponsiveSheet>
  );
};
