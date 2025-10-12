"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

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
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Pago en Revisión</h1>
          <p className="text-gray-400 mb-8">
            Tu orden de pago ha sido recibida y está siendo procesada.
            <br />
            Te notificaremos cuando sea aprobada.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">
              Detalles de tu Orden
            </h2>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>ID de Orden:</span>
                <span className="font-mono text-white">{orderId?.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="font-medium text-[#FFC700]">Pendiente</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFC700]/10 border border-[#FFC700]/30 rounded-lg p-4 mb-8">
            <h3 className="text-sm font-bold text-[#FFC700] mb-2">
              ¿Qué sigue?
            </h3>
            <ul className="text-sm text-gray-300 text-left space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#FFC700]">1.</span>
                <span>Verificaremos tu comprobante de pago</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFC700]">2.</span>
                <span>Te enviaremos un email cuando sea aprobado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFC700]">3.</span>
                <span>Tu suscripción se activará automáticamente</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-[#FFC700] text-black px-6 py-3 rounded-md font-bold hover:bg-[#FFD700] transition-colors"
            >
              Volver al Inicio
            </Link>
            <Link
              href="/orders"
              className="block w-full border border-white/20 text-white px-6 py-3 rounded-md font-medium hover:bg-white/5 transition-colors"
            >
              Ver Mis Órdenes
            </Link>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          ¿Problemas con tu pago?{" "}
          <Link href="#contact" className="text-[#FFC700] hover:underline">
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-white">Cargando...</div>
        </div>
      }
    >
      <PendingContent />
    </Suspense>
  );
}
