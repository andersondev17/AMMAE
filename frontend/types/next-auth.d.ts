// types/next-auth.d.ts
import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

// Define la interfaz de usuario personalizada
export interface AuthUser {
    id: string;
    name?: string | null;
    email?: string | null;
    role: "user" | "admin";
    username?: string | null;
    emailVerified?: Date | null;
}

// Extiende el módulo JWT
declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        user: AuthUser;
        accessToken: string;
    }
}

// Extiende el módulo Session
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: AuthUser & DefaultUser;
        accessToken: string;
    }

    // Extiende el tipo User para el proveedor de credenciales
    interface User extends DefaultUser, AuthUser {
        accessToken: string;
    }
}