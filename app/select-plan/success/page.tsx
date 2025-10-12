"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function SuccessPage() {
  const { data: session, update } = useSession();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Update session to reflect new subscription
    update();

    // Countdown and redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [update]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-black">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-[#FFC700] rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            ¡Suscripción Activada!
          </h1>
          <p className="text-gray-400 mb-8">
            Tu plan ha sido activado correctamente.
            <br />
            Bienvenido a <span className="text-[#FFC700] font-bold">MEGAGYM</span>
          </p>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Detalles de tu Suscripción</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Nombre:</span>
                <span className="font-medium text-white">{session?.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium text-white">{session?.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="font-medium text-[#FFC700]">Activo ✓</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-[#FFC700] text-black px-6 py-3 rounded-md font-bold hover:bg-[#FFD700] transition-colors"
            >
              Ir al Inicio
            </Link>
            <p className="text-sm text-gray-500">
              Serás redirigido automáticamente en {countdown} segundos...
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          ¿Necesitas ayuda?{" "}
          <Link href="#contact" className="text-[#FFC700] hover:underline">
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}
