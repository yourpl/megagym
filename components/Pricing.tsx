export default function Pricing() {
  const plans = [
    {
      name: "PLAN SEMANAL",
      price: "11.99",
      period: "semana",
      features: [
        { text: "ZONA DE CARDIO", included: true },
        { text: "ZONA DE PESO LIBRE", included: true },
        { text: "ZONA FUNCIONAL", included: true },
        { text: "CLASES DEDICADAS", included: true },
        { text: "INVITA UN AMIGO\nTODOS LOS VIERNES\nGRATIS", included: false },
        { text: "EVALUACIÓN MÉDICA\nINICIAL", included: false },
      ],
    },
    {
      name: "PLAN QUINCENAL",
      price: "19.99",
      period: "quincena",
      features: [
        { text: "ZONA DE CARDIO", included: true },
        { text: "ZONA DE PESO LIBRE", included: true },
        { text: "ZONA FUNCIONAL", included: true },
        { text: "CLASES DEDICADAS", included: true },
        { text: "INVITA UN AMIGO\nTODOS LOS VIERNES\nGRATIS", included: true },
        { text: "EVALUACIÓN MÉDICA\nINICIAL", included: false },
      ],
      popular: true,
    },
    {
      name: "PLAN MENSUAL",
      price: "37.99",
      period: "mes",
      features: [
        { text: "ZONA DE CARDIO", included: true },
        { text: "ZONA DE PESO LIBRE", included: true },
        { text: "ZONA FUNCIONAL", included: true },
        { text: "CLASES DEDICADAS", included: true },
        { text: "INVITA UN AMIGO\nTODOS LOS VIERNES\nGRATIS", included: true },
        { text: "EVALUACIÓN MÉDICA\nINICIAL", included: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="min-h-screen flex items-center justify-center px-6 py-24 border-t border-white/10 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-[#FFC700]">INSCRIPCIÓN</span>
          </h2>
          <h1 className="text-6xl md:text-8xl font-black text-[#FFC700] mb-4 tracking-tight">
            GRATIS
          </h1>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
            MEGA PLANES
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105"
            >
              <div className="bg-gradient-to-r from-[#FFC700] to-[#FFB400] p-6">
                <h3 className="text-2xl font-black text-black uppercase tracking-wide text-center">{plan.name}</h3>
              </div>

              <div className="p-8 bg-gray-100">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <svg className="w-7 h-7 text-[#7CC042] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="text-sm font-bold text-black leading-tight whitespace-pre-line">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-6xl font-black text-black">${plan.price}</span>
                  </div>
                </div>
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
