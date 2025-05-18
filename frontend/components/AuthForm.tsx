"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FIELD_LABELS, FIELD_TYPES } from "@/constants";
import { AuthFormProps } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
/**
 * Componente de formulario de autenticación
 * Soporta login y registro con validación Zod
 */
const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit, isLoading: externalLoading}: AuthFormProps<T>) => {
  const router = useRouter();
  const isLogin = type === "LOGIN";
  const [internalLoading, setInternalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Usar estado de carga externo si se proporciona, de lo contrario usar estado interno
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

    const handleSubmit: SubmitHandler<T> = async (data) => {
    if (!externalLoading) setInternalLoading(true);

    try {
      const result = await onSubmit(data);

      if (result.success) {
        toast.success(isLogin ? "¡Inicio de sesión exitoso!" : "¡Cuenta creada exitosamente!");
        router.push(isLogin ? "/" : "/login");
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error: unknown) {
      console.error("Auth error:", error);
      toast.error(
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
    } finally {
      if (!externalLoading) setInternalLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {isLogin ? "Inicia sesión" : "Crea tu cuenta"}
        </h1>
        <p className="text-gray-300 mt-2 text-center">
          {isLogin
            ? "Accede para personalizar tu experiencia de fitness"
            : "Comienza tu viaje fitness con nosotros"}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5"
        >
          {Object.keys(defaultValues).map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">
                    {FIELD_LABELS[fieldName] || fieldName}
                  </FormLabel>
                  <FormControl>
                    {fieldName === "password" || fieldName === "confirmPassword" ? (
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={
                            fieldName === "password"
                              ? (isLogin ? "Tu contraseña" : "Mínimo 8 caracteres")
                              : "Confirma tu contraseña"
                          }
                          className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:ring-red-500 focus:border-red-500 pr-10"
                          autoComplete={
                            fieldName === "password"
                              ? (isLogin ? "current-password" : "new-password")
                              : "new-password"
                          }
                          disabled={isLoading}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    ) : (
                      <Input
                        type={FIELD_TYPES[fieldName] || "text"}
                        placeholder={
                          fieldName === "email"
                            ? "tu@email.com"
                            : `Ingresa tu ${FIELD_LABELS[fieldName] || fieldName}`
                        }
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:ring-red-500 focus:border-red-500"
                        autoComplete={fieldName}
                        disabled={isLoading}
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          ))}

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember" className="text-red-500 focus:ring-red-500" />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-300">
                  Recordar sesión
                </label>
              </div>
              <a href="#" className="text-sm text-red-500 hover:text-red-400">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : (
              isLogin ? "Iniciar Sesión" : "Crear Cuenta"
            )}
          </Button>

          {/* Enlaces para alternar entre login y registro */}
          <p className="text-center text-sm text-gray-400 mt-4">
            {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="ml-1 text-red-500 hover:text-red-400 font-medium"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </Link>
          </p>
        </form>
      </Form>

      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        <p>GymShock © {new Date().getFullYear()} - Todos los derechos reservados</p>
        <p className="mt-1">Al continuar, aceptas nuestros <a href="#" className="text-red-500 hover:text-red-400">Términos y Condiciones</a> y <a href="#" className="text-red-500 hover:text-red-400">Política de Privacidad</a></p>
      </div>
    </div>
  );
}

export default AuthForm;