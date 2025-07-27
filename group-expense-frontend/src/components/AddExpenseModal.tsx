import React, { useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Stack,
  Group,
  Text,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconCurrencyDollar } from "@tabler/icons-react";
import { CreateExpenseData, Category } from "../services/expenseService";

interface AddExpenseModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExpenseData) => Promise<void>;
  categories: Category[];
  loading?: boolean;
  groupId: number;
}

interface FormValues {
  amount: number | string;
  description: string;
  date: string;
  categoryId: string | null;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  opened,
  onClose,
  onSubmit,
  categories,
  loading = false,
  groupId,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
      categoryId: null,
    },
    validate: {
      amount: (value) => {
        if (!value || value === "") return "Amount is required";
        const numValue = typeof value === "string" ? parseFloat(value) : value;
        if (isNaN(numValue) || numValue <= 0)
          return "Amount must be greater than 0";
        return null;
      },
      description: (value) =>
        value.trim().length === 0 ? "Description is required" : null,
      date: (value) =>
        !value || value.trim() === "" ? "Date is required" : null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const amount =
        typeof values.amount === "string"
          ? parseFloat(values.amount)
          : values.amount;

      const expenseData: CreateExpenseData = {
        amount,
        description: values.description.trim(),
        date: values.date ? new Date(values.date).toISOString() : undefined,
        categoryId: values.categoryId ? parseInt(values.categoryId) : undefined,
        groupId,
      };

      await onSubmit(expenseData);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Failed to create expense:", error);
      notifications.show({
        title: "Error",
        message: "Failed to add expense. Please try again.",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Prepare category options for Select component
  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <IconCurrencyDollar size={20} />
          <Text fw={600}>Add New Expense</Text>
        </Group>
      }
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Amount Input */}
          <NumberInput
            label="Amount"
            placeholder="0.00"
            leftSection={<IconCurrencyDollar size={16} />}
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            required
            {...form.getInputProps("amount")}
          />

          {/* Description Input */}
          <Textarea
            label="Description"
            placeholder="What was this expense for?"
            required
            minRows={2}
            maxRows={4}
            autosize
            {...form.getInputProps("description")}
          />

          {/* Date Input */}
          <TextInput
            label="Date"
            placeholder="When did this expense occur?"
            leftSection={<IconCalendar size={16} />}
            type="date"
            required
            max={new Date().toISOString().split("T")[0]}
            {...form.getInputProps("date")}
          />

          {/* Category Select */}
          <Select
            label="Category"
            placeholder="Select a category (optional)"
            data={categoryOptions}
            searchable
            clearable
            {...form.getInputProps("categoryId")}
          />

          {/* Action Buttons */}
          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={handleClose}
              disabled={submitting || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Expense
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
