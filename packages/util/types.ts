import { ReactNode } from "react";
import { ZodIssue } from "@ntla9aw/forms/src";

export type Role = "admin" | "manager";
export type MenuItem = { label: string; href: string; loggedIn: boolean };

export type BaseComponent = {
  children?: ReactNode;
  className?: string;
};

export type ValidationError = Partial<Pick<ZodIssue, "path" | "message">>;

export interface FormState {
  data?: string | null;
  error?: ValidationError[] | null;
}
