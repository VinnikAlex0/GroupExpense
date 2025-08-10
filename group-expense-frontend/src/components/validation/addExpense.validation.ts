// Mantine's useForm accepts an object with field validators; we type it loosely here
type FieldValidators<T> = {
  [K in keyof T]?: (value: any) => string | null;
};

export type AddExpenseFormValues = {
  amount: number | string;
  description: string;
  date: string;
  categoryId: string | null;
};

const toNumber = (value: number | string | undefined): number => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

// Field-level validation for AddExpense form inputs
export const addExpenseFormValidate: FieldValidators<AddExpenseFormValues> = {
  amount: (value: any) => {
    const num = toNumber(value);
    if (!num || num <= 0) return "Amount must be greater than 0";
    return null;
  },
  description: (value: any) =>
    value && value.trim().length > 0 ? null : "Description is required",
  date: (value: any) => (value && value.trim() ? null : "Date is required"),
};

// Cross-field validation to ensure shares sum to total
export const validateSharesAgainstTotal = (
  totalAmount: number,
  includedIds: string[],
  sharesByUserId: Record<string, string>
): { ok: boolean; error?: string } => {
  if (!includedIds || includedIds.length === 0) {
    return { ok: false, error: "At least one participant must be included" };
  }
  const totalCents = Math.round(Number(totalAmount || 0) * 100);
  const sumCents = Math.round(
    includedIds.reduce(
      (acc, id) => acc + (parseFloat(sharesByUserId[id] || "0") || 0),
      0
    ) * 100
  );
  if (sumCents !== totalCents) {
    return { ok: false, error: "Sum of shares must equal total amount" };
  }
  return { ok: true };
};
