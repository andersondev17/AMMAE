import { z } from "zod";

export const userSchema = z.object({
    id: z.string().uuid({ message: "ID de usuario inválido" }),
    username: z.string().min(1, { message: "El username es requerido" }),
    email: z.string().email({ message: "Correo inválido" }),
    role: z.string().min(1, { message: "El role es requerido" }),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    profilePicture: z.string().url({ message: "URL de foto inválida" }).optional(),
});

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})
export const authSubmitResultSchema = z.object({
    success: z.boolean(),
    token: z.string().optional(),
    user: userSchema.optional(),
    error: z.string().optional(),
});
export const verifyResultSchema = z.object({
    isValid: z.boolean(),
});



export type User = z.infer<typeof userSchema>;
export type AuthSubmitResult = z.infer<typeof authSubmitResultSchema>;
export type VerifyResult = z.infer<typeof verifyResultSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;