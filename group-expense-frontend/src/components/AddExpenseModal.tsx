import React, { useEffect, useMemo, useState } from "react";
import { Button, Stack, Group, Text } from "@mantine/core";

import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { CreateExpenseData, Category } from "../services/expenseService";
import { GroupMember } from "../services/groupService";
import { equalize, reallocateWithLocks } from "./add-expense/splitUtils";
import { AddExpenseForm } from "./forms/AddExpenseForm";
import {
  addExpenseFormValidate,
  validateSharesAgainstTotal,
} from "./validation/addExpense.validation";
import { ResponsiveSheet } from "./responsive/ResponsiveSheet";

interface AddExpenseModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExpenseData) => Promise<void>;
  categories: Category[];
  loading?: boolean;
  groupId: number;
  members: GroupMember[];
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
  members,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [splitMode, setSplitMode] = useState<"equal" | "custom">("equal");
  const [includedIds, setIncludedIds] = useState<string[]>([]);
  const [sharesByUserId, setSharesByUserId] = useState<Record<string, string>>(
    {}
  );
  const [shareError, setShareError] = useState<string | null>(null);
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());

  const form = useForm<FormValues>({
    initialValues: {
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
      categoryId: null,
    },
    validate: addExpenseFormValidate,
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const amount =
        typeof values.amount === "string"
          ? parseFloat(values.amount)
          : values.amount;

      // Validate split before submit using cross-field validation
      const cross = validateSharesAgainstTotal(
        typeof amount === "string" ? parseFloat(amount) : amount,
        includedIds,
        sharesByUserId
      );
      if (!cross.ok) {
        setShareError(cross.error || "Invalid split");
        setSubmitting(false);
        return;
      }

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

  const resetState = () => {
    form.setValues({
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      categoryId: null,
    });
    setStep(1);
    setSplitMode("equal");
    setIncludedIds([]);
    setSharesByUserId({});
    setLockedIds(new Set());
    setShareError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Prepare category options for Select component
  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  // Helpers moved to splitUtils

  const onNextFromAmount = () => {
    const amountValue =
      typeof form.values.amount === "string"
        ? parseFloat(form.values.amount)
        : form.values.amount;
    if (!amountValue || amountValue <= 0) return;

    // Initialize participants and shares
    const ids = members.map((m) => m.userId);
    setIncludedIds(ids);
    setSharesByUserId(equalize(Number(amountValue), ids));
    setShareError(null);
    setStep(2);
  };

  // When the modal opens anew, reset the internal wizard state
  useEffect(() => {
    if (opened) {
      resetState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  // Re-equalize when amount changes in equal mode while on step 2
  useEffect(() => {
    if (step !== 2 || splitMode !== "equal") return;
    const amountValue =
      typeof form.values.amount === "string"
        ? parseFloat(form.values.amount)
        : form.values.amount;
    setSharesByUserId(equalize(Number(amountValue || 0), includedIds));
  }, [form.values.amount, splitMode, step, includedIds]);

  // Reallocate in custom mode when total or participants change
  useEffect(() => {
    if (step !== 2 || splitMode !== "custom") return;
    const total =
      typeof form.values.amount === "string"
        ? parseFloat(form.values.amount)
        : form.values.amount;
    const totalCents = Math.round(Number(total || 0) * 100);
    setSharesByUserId((prev) =>
      reallocateWithLocks(totalCents, includedIds, lockedIds, prev)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.amount, splitMode, step, includedIds, lockedIds.size]);

  const remainingDisplay = useMemo(() => {
    const total =
      typeof form.values.amount === "string"
        ? parseFloat(form.values.amount)
        : form.values.amount;
    const sum = includedIds.reduce(
      (acc, id) => acc + (parseFloat(sharesByUserId[id] || "0") || 0),
      0
    );
    return (Number(total || 0) - sum).toFixed(2);
  }, [sharesByUserId, includedIds, form.values.amount]);

  const canSubmit = useMemo(() => {
    return includedIds.length > 0 && remainingDisplay === "0.00";
  }, [includedIds.length, remainingDisplay]);

  const footer = (
    <Stack gap="xs">
      {step === 2 ? (
        <>
          <Button
            type="submit"
            form="add-expense-form"
            disabled={!canSubmit}
            className="w-full"
            radius="md"
            variant="filled"
            size="md"
          >
            Add Expense
          </Button>
          <Button
            variant="subtle"
            className="w-full"
            radius="md"
            size="md"
            onClick={() => setStep(1)}
          >
            Back
          </Button>
        </>
      ) : (
        <>
          <Button
            className="w-full"
            radius="md"
            variant="filled"
            size="md"
            onClick={onNextFromAmount}
          >
            Next
          </Button>
          <Button
            className="w-full"
            radius="md"
            variant="subtle"
            size="md"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </>
      )}
    </Stack>
  );

  return (
    <ResponsiveSheet
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <IconCurrencyDollar size={20} />
          <Text fw={600}>Add New Expense</Text>
        </Group>
      }
      footer={footer}
    >
      <form id="add-expense-form" onSubmit={form.onSubmit(handleSubmit)}>
        <AddExpenseForm
          form={form as any}
          categories={categories}
          remainingDisplay={remainingDisplay}
          shareError={shareError}
          onEqualize={() => {
            const amountValue =
              typeof form.values.amount === "string"
                ? parseFloat(form.values.amount)
                : form.values.amount;
            setSharesByUserId(equalize(Number(amountValue || 0), includedIds));
            setLockedIds(new Set());
            setSplitMode("equal");
            setShareError(null);
          }}
          splitEditorProps={{
            members,
            includedIds,
            setIncludedIds,
            sharesByUserId,
            setSharesByUserId: (updater: any) =>
              setSharesByUserId((prev) => updater(prev)),
            lockedIds,
            setLockedIds,
            splitMode,
            setSplitMode,
            totalAmount:
              typeof form.values.amount === "string"
                ? parseFloat(form.values.amount)
                : form.values.amount || 0,
            setShareError,
          }}
          step={step}
        />
      </form>
    </ResponsiveSheet>
  );
};
