import React, { useState } from "react";
import { Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconUserPlus } from "@tabler/icons-react";
import { Role } from "../services/groupService";
import { ResponsiveSheet } from "./responsive/ResponsiveSheet";
import { InviteMemberForm } from "./forms/InviteMemberForm";
import { inviteMemberFormValidate } from "./validation/inviteMember.validation";

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
    validate: inviteMemberFormValidate,
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

  const footer = (
    <Stack gap="xs">
      <Button
        type="submit"
        form="invite-member-form"
        className="w-full"
        radius="md"
        variant="filled"
        size="md"
        loading={submitting || loading}
        leftSection={<IconUserPlus size={16} />}
      >
        Invite Member
      </Button>
      <Button
        className="w-full"
        radius="md"
        variant="subtle"
        size="md"
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
        <InviteMemberForm form={form} disabled={submitting} />
      </form>
    </ResponsiveSheet>
  );
};
