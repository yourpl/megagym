"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: { [key: string]: string } = {
    Configuration: "Hay un problema con la configuración del servidor.",
    AccessDenied: "No tienes permiso para acceder.",
    Verification: "El token de verificación ha expirado o ya fue usado.",
    OAuthSignin: "Error al intentar iniciar sesión con el proveedor.",
    OAuthCallback: "Error al procesar la respuesta del proveedor.",
    OAuthCreateAccount: "No se pudo crear la cuenta con el proveedor.",
    EmailCreateAccount: "No se pudo crear la cuenta con email.",
    Callback: "Error en el proceso de autenticación.",
    OAuthAccountNotLinked:
      "Este email ya está asociado a otra cuenta. Inicia sesión con el método original.",
    EmailSignin: "No se pudo enviar el email de inicio de sesión.",
    CredentialsSignin: "Credenciales incorrectas. Verifica tu email y contraseña.",
    SessionRequired: "Debes iniciar sesión para acceder a esta página.",
    Default: "Ocurrió un error durante la autenticación.",
  };

  const message = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-black">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Error de Autenticación</h1>
          <p className="text-gray-400 mb-8">{message}</p>

          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full bg-[#FFC700] text-black px-6 py-3 rounded-md font-bold hover:bg-[#FFD700] transition-colors"
            >
              Volver a Iniciar Sesión
            </Link>
            <Link
              href="/"
              className="block w-full border border-white/20 text-white px-6 py-3 rounded-md font-medium hover:bg-white/5 transition-colors"
            >
              Ir al Inicio
            </Link>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          ¿Necesitas ayuda?{" "}
          <Link href="#contact" className="text-[#FFC700] hover:underline">
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-white">Cargando...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
