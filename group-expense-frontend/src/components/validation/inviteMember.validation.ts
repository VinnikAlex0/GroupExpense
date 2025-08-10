import { Role } from "../../services/groupService";

export type InviteMemberFormValues = {
  email: string;
  role: Role;
};

type FieldValidators<T> = { [K in keyof T]?: (value: any) => string | null };

export const inviteMemberFormValidate: FieldValidators<InviteMemberFormValues> =
  {
    email: (value: any) => {
      if (!value || !value.trim()) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value.trim())
        ? null
        : "Please enter a valid email address";
    },
  };
