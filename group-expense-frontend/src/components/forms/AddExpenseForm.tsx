import React from "react";
import {
  Stack,
  NumberInput,
  Textarea,
  TextInput,
  Select,
  Group,
  Text,
  Button,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconCalendar, IconCurrencyDollar } from "@tabler/icons-react";
import { Category } from "../../services/expenseService";
import { SplitEditor } from "../add-expense/SplitEditor";

interface AddExpenseFormProps {
  form: UseFormReturnType<{
    amount: number | string;
    description: string;
    date: string;
    categoryId: string | null;
  }>;
  categories: Category[];
  remainingDisplay: string;
  shareError: string | null;
  onEqualize: () => void;
  splitEditorProps: React.ComponentProps<typeof SplitEditor>;
  step: 1 | 2;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  form,
  categories,
  remainingDisplay,
  shareError,
  onEqualize,
  splitEditorProps,
  step,
}) => {
  const categoryOptions = categories.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }));

  return (
    <Stack gap="md">
      {step === 1 ? (
        <>
          <NumberInput
            label="Amount"
            placeholder="0.00"
            leftSection={<IconCurrencyDollar size={16} />}
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            required
            size="md"
            radius="md"
            {...form.getInputProps("amount")}
          />
          <div />
        </>
      ) : (
        <>
          <Textarea
            label="Description"
            placeholder="What was this expense for?"
            required
            minRows={2}
            maxRows={4}
            autosize
            size="md"
            radius="md"
            {...form.getInputProps("description")}
          />
          <TextInput
            label="Date"
            placeholder="When did this expense occur?"
            leftSection={<IconCalendar size={16} />}
            type="date"
            required
            max={new Date().toISOString().split("T")[0]}
            size="md"
            radius="md"
            {...form.getInputProps("date")}
          />
          <Select
            label="Category"
            placeholder="Select a category (optional)"
            data={categoryOptions}
            searchable
            clearable
            size="md"
            radius="md"
            {...form.getInputProps("categoryId")}
          />

          <SplitEditor {...splitEditorProps} />

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Remaining
            </Text>
            <Text fw={600} c={remainingDisplay === "0.00" ? undefined : "red"}>
              ${remainingDisplay}
            </Text>
          </Group>
          {shareError && (
            <Text c="red" size="sm" mt="xs">
              {shareError}
            </Text>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="light" size="md" onClick={onEqualize}>
              Equalize
            </Button>
          </Group>
        </>
      )}
    </Stack>
  );
};
