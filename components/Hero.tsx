export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-7xl mx-auto text-center">
        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-3xl p-12 md:p-16 shadow-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Transform Your
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Body & Mind
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
            Join the ultimate fitness experience with state-of-the-art equipment,
            expert trainers, and a community that pushes you to be your best.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105">
              Start Free Trial
            </button>
            <button className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all">
              View Plans
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl p-6">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-white/70">Active Members</div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl p-6">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-white/70">Expert Trainers</div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl p-6">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/70">Open Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
