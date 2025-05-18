import { DefaultValues, FieldValues } from "react-hook-form";
import { ZodType } from "zod";

export type UserRole = "user" | "admin";

export interface AuthSubmitResult {
    success: boolean;
    error?: string;
}

export type AuthType = "LOGIN" | "REGISTER";

export interface AuthFormProps<T extends FieldValues> {
    type: AuthType;
    schema: ZodType<T>;
    defaultValues: DefaultValues<T>;
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
    isLoading?: boolean;
}

export interface AuthUser {
    id: string;
    role: UserRole;
    email?: string | null;
    name?: string | null;
    avatar?: string | null;
    username?: string | null;
    lastLogin?: Date | null;
}

export interface AuthState {
    user: AuthUser | null;
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;
}