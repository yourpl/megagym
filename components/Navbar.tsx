"use client";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight text-white">
            MEGAGYM
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="/" className="text-sm text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="/#about" className="text-sm text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <a href="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-sm text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:block text-sm text-gray-300 hover:text-white transition-colors">
              Sign In
            </button>
            <button className="bg-white text-black px-5 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
