"use client";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">
              MegaGym
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-white/90 hover:text-white transition-colors">
                Home
              </a>
              <a href="#about" className="text-white/90 hover:text-white transition-colors">
                About
              </a>
              <a href="#pricing" className="text-white/90 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#contact" className="text-white/90 hover:text-white transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden md:block text-white/90 hover:text-white transition-colors">
                Sign In
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2 rounded-lg transition-all border border-white/30">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
