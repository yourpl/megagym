"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const plans = [
  {
    id: "diario",
    name: "PLAN DIARIO",
    price: 3.00,
    duration: "día",
  },
  {
    id: "semanal",
    name: "PLAN SEMANAL",
    price: 11.99,
    duration: "semana",
  },
  {
    id: "quincenal",
    name: "PLAN QUINCENAL",
    price: 19.99,
    duration: "quincena",
    popular: true,
  },
  {
    id: "mensual",
    name: "PLAN MENSUAL",
    price: 37.99,
    duration: "mes",
  },
];

function CheckoutContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("quincenal");

  // Get plan from URL if present
  useEffect(() => {
    const planFromUrl = searchParams.get("plan");
    if (planFromUrl && plans.find((p) => p.id === planFromUrl)) {
      setSelectedPlan(planFromUrl);
      setStep(2); // Skip plan selection if coming from select-plan page
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    paymentMethod: "transfer",
    reference: "",
    notes: "",
  });

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string>("");

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload proof if exists
      let proofUrl = "";
      if (proofFile) {
        const uploadData = new FormData();
        uploadData.append("file", proofFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir el comprobante");
        }

        const uploadResult = await uploadResponse.json();
        proofUrl = uploadResult.url;
      }

      // Create payment order
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan,
          paymentMethod: formData.paymentMethod,
          reference: formData.reference,
          proofUrl,
          customerData: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al procesar la orden");
      }

      router.push(`/checkout/pending?orderId=${data.orderId}`);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Completa tu <span className="text-[#FFC700]">Pago</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mt-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? "bg-[#FFC700] text-black" : "bg-white/10 text-gray-500"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 ${step > s ? "bg-[#FFC700]" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-16 mt-4 text-sm text-gray-400">
            <span className={step === 1 ? "text-[#FFC700]" : ""}>Plan</span>
            <span className={step === 2 ? "text-[#FFC700]" : ""}>Datos</span>
            <span className={step === 3 ? "text-[#FFC700]" : ""}>Pago</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Plan Selection */}
          {step === 1 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Selecciona tu Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? "border-[#FFC700] bg-[#FFC700]/10"
                        : "border-white/10 hover:border-white/30"
                    } ${plan.popular ? "relative" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFC700] text-black text-xs font-bold px-4 py-1 rounded-full">
                        Más Popular
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="text-4xl font-bold text-[#FFC700] mb-2">
                        ${plan.price}
                      </div>
                      <p className="text-gray-400 text-sm">por {plan.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-[#FFC700] text-black px-8 py-3 rounded-md font-bold hover:bg-[#FFD700] transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Customer Data */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Tus Datos
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-white/20 text-white px-8 py-3 rounded-md font-medium hover:bg-white/5"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-[#FFC700] text-black px-8 py-3 rounded-md font-bold hover:bg-[#FFD700]"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Método de Pago
              </h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
                {/* Resumen */}
                <div className="pb-6 border-b border-white/10">
                  <h3 className="text-lg font-bold text-white mb-2">Resumen</h3>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-300">{selectedPlanData?.name}</span>
                    <span className="text-[#FFC700] font-bold text-xl">
                      ${selectedPlanData?.price}
                    </span>
                  </div>
                </div>

                {/* Método de Pago */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Método de Pago *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "transfer" })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.paymentMethod === "transfer"
                          ? "border-[#FFC700] bg-[#FFC700]/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="text-white font-medium">Transferencia</div>
                      <div className="text-xs text-gray-400 mt-1">Bancaria</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "paypal" })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.paymentMethod === "paypal"
                          ? "border-[#FFC700] bg-[#FFC700]/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="text-white font-medium">PayPal</div>
                      <div className="text-xs text-gray-400 mt-1">Pago en línea</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "cash" })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.paymentMethod === "cash"
                          ? "border-[#FFC700] bg-[#FFC700]/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="text-white font-medium">Efectivo</div>
                      <div className="text-xs text-gray-400 mt-1">En gimnasio</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "other" })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.paymentMethod === "other"
                          ? "border-[#FFC700] bg-[#FFC700]/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="text-white font-medium">Otro</div>
                      <div className="text-xs text-gray-400 mt-1">Especificar</div>
                    </button>
                  </div>
                </div>

                {/* Datos de pago */}
                {formData.paymentMethod === "transfer" && (
                  <div className="bg-[#FFC700]/10 border border-[#FFC700]/30 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-[#FFC700] mb-2">
                      Datos para Transferencia
                    </h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>Banco: Banco Nacional</p>
                      <p>Cuenta: 1234-5678-9012-3456</p>
                      <p>Titular: MEGAGYM S.A.</p>
                      <p>Referencia: Tu nombre completo</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Referencia / Número de Transacción
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                    placeholder="Ej: TRX123456789"
                  />
                </div>

                {/* Comprobante */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Comprobante de Pago (Opcional)
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    {proofPreview ? (
                      <div className="space-y-4">
                        <img
                          src={proofPreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProofFile(null);
                            setProofPreview("");
                          }}
                          className="text-red-400 text-sm hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id="proof"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="proof"
                          className="cursor-pointer text-gray-400 hover:text-white"
                        >
                          <div className="text-4xl mb-2">📷</div>
                          <div className="text-sm">
                            Click para subir comprobante
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            PNG, JPG hasta 5MB
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notas (Opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
                    placeholder="Información adicional..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="flex-1 border border-white/20 text-white px-6 py-3 rounded-md font-medium hover:bg-white/5 disabled:opacity-50"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#FFC700] text-black px-6 py-3 rounded-md font-bold hover:bg-[#FFD700] disabled:opacity-50"
                  >
                    {loading ? "Procesando..." : "Enviar Orden"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#FFC700] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
