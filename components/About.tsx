export default function About() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-6 py-24 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Built for Champions
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Since 2015, MegaGym has been the training ground for elite athletes,
              fitness professionals, and individuals committed to excellence.
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Our facility combines cutting-edge equipment, evidence-based training
              programs, and expert guidance to deliver measurable results.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-1 h-6 bg-white mt-1"></div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Professional Equipment</h3>
                  <p className="text-gray-400 text-sm">Premium machines and free weights from industry leaders</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1 h-6 bg-white mt-1"></div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Certified Trainers</h3>
                  <p className="text-gray-400 text-sm">Expert coaches with proven track records</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1 h-6 bg-white mt-1"></div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Results-Driven</h3>
                  <p className="text-gray-400 text-sm">Data-backed methodologies and personalized programming</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-white/10 p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Workouts</div>
              </div>
            </div>
            <div className="border border-white/10 p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Satisfaction</div>
              </div>
            </div>
            <div className="border border-white/10 p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">15+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Countries</div>
              </div>
            </div>
            <div className="border border-white/10 p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
