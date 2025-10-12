"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-[#FFC700]/20 bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight text-white">
            MEGA<span className="text-[#FFC700]">GYM</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-sm text-gray-300 hover:text-[#FFC700] transition-colors">
              Home
            </Link>
            <Link href="/#about" className="text-sm text-gray-300 hover:text-[#FFC700] transition-colors">
              About
            </Link>
            <Link href="/pricing" className="text-sm text-gray-300 hover:text-[#FFC700] transition-colors">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm text-gray-300 hover:text-[#FFC700] transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="hidden md:block w-20 h-10 bg-white/10 animate-pulse rounded"></div>
            ) : session ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-gray-300">
                    Hola, {session.user?.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm text-gray-300 hover:text-[#FFC700] transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="hidden md:block text-sm text-gray-300 hover:text-[#FFC700] transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/signup"
                  className="hidden md:block bg-[#FFC700] text-black px-6 py-2 text-sm font-bold hover:bg-[#FFD700] transition-all rounded-md"
                >
                  Comenzar
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              href="/"
              className="block text-sm text-gray-300 hover:text-[#FFC700] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/#about"
              className="block text-sm text-gray-300 hover:text-[#FFC700] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="block text-sm text-gray-300 hover:text-[#FFC700] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="block text-sm text-gray-300 hover:text-[#FFC700] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 space-y-3 border-t border-[#FFC700]/20">
              {session ? (
                <>
                  <div className="text-sm text-gray-300 mb-2">
                    Hola, {session.user?.name?.split(" ")[0]}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full text-left text-sm text-gray-300 hover:text-[#FFC700] transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="block w-full text-left text-sm text-gray-300 hover:text-[#FFC700] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full bg-[#FFC700] text-black px-6 py-2 text-sm font-bold hover:bg-[#FFD700] transition-all rounded-md text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Comenzar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
