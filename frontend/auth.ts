// auth.ts
import { AuthUser } from '@/types/auth.types';
import NextAuth from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login',
    error: '/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos');
        }

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (response.status === 429) {
            throw new Error('Woow no tan rapido. Por favor, espera un momento.');
          }
          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.error || 'Credenciales inválidas');
          }

          if (!data.user || !data.user.id) {
            throw new Error('Formato de respuesta inválido');
          }

          // patron adapter
          return {
            id: String(data.user.id),
            email: data.user.email,
            role: data.user.role || "user",
            name: data.user.firstName || data.user.email.split('@')[0],
            accessToken: data.token || "",
          };
        } catch (error) {
          throw error instanceof Error ? error : new Error('Error de autenticación');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: String(user.id),
          email: user.email,
          role: user.role,
          name: user.name
        };
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          ...session.user,
          id: String(token.user.id),
          role: token.user.role,
          email: token.user.email,
          name: token.user.name,
        } as AuthUser & AdapterUser;
      }

      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }

      return session;
    }
  }
})