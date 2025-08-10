export type CreateGroupFormValues = {
  name: string;
  description?: string;
};

type FieldValidators<T> = { [K in keyof T]?: (value: any) => string | null };

export const createGroupFormValidate: FieldValidators<CreateGroupFormValues> = {
  name: (value: any) =>
    value && value.trim().length >= 2
      ? null
      : "Group name must have at least 2 letters",
};
