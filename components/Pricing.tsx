export default function Pricing() {
  const plans = [
    {
      name: "PLAN SEMANAL",
      price: "11.99",
      period: "semana",
      features: [
        { text: "Zona de cardio", included: true },
        { text: "Zona de peso libre", included: true },
        { text: "Zona funcional", included: true },
        { text: "Clase de zumba", included: false },
        { text: "Clase de aeróbicos", included: false },
        { text: "Invita un amigo todos los viernes gratis", included: false },
        { text: "Evaluación médica inicial", included: false },
      ],
    },
    {
      name: "PLAN QUINCENAL",
      price: "19.99",
      period: "quincena",
      features: [
        { text: "Zona de cardio", included: true },
        { text: "Zona de peso libre", included: true },
        { text: "Zona funcional", included: true },
        { text: "Clase de zumba", included: true },
        { text: "Clase de aeróbicos", included: true },
        { text: "Invita un amigo todos los viernes gratis", included: true },
        { text: "Evaluación médica inicial", included: false },
      ],
      popular: true,
    },
    {
      name: "PLAN MENSUAL",
      price: "37.99",
      period: "mes",
      features: [
        { text: "Zona de cardio", included: true },
        { text: "Zona de peso libre", included: true },
        { text: "Zona funcional", included: true },
        { text: "Clase de zumba", included: true },
        { text: "Clase de aeróbicos", included: true },
        { text: "Invita un amigo todos los viernes gratis", included: true },
        { text: "Evaluación médica inicial", included: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="min-h-screen flex items-center justify-center px-6 py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            MEGA PLANES
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus objetivos de entrenamiento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border ${
                plan.popular ? "border-[#FFC700]" : "border-white/10"
              } bg-gradient-to-b from-white/5 to-transparent rounded-lg overflow-hidden relative`}
            >
              <div className="bg-[#FFC700] p-6">
                <h3 className="text-2xl font-bold text-black uppercase tracking-wide">{plan.name}</h3>
              </div>

              {plan.popular && (
                <div className="absolute top-2 right-2 bg-white text-black text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full">
                  Popular
                </div>
              )}

              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-white' : 'text-gray-500'} uppercase`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">por {plan.period}</p>
                </div>

                <button
                  className={`w-full py-4 text-sm font-bold uppercase tracking-wide transition-colors rounded-md ${
                    plan.popular
                      ? "bg-[#FFC700] text-black hover:bg-[#FFD700]"
                      : "border-2 border-[#FFC700] text-[#FFC700] hover:bg-[#FFC700] hover:text-black"
                  }`}
                >
                  Comenzar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            Todos los planes incluyen acceso a instalaciones y zonas de entrenamiento.{" "}
            <a href="#contact" className="text-[#FFC700] hover:underline">
              Contáctanos
            </a>{" "}
            para planes corporativos o grupales.
          </p>
        </div>
      </div>
    </section>
  );
}
