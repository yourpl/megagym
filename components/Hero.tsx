"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleStartTraining = () => {
    if (status === "authenticated") {
      // If logged in, go to profile/dashboard
      router.push("/profile");
    } else {
      // If not logged in, go to signup
      router.push("/auth/signup");
    }
  };

  const handleViewFacilities = () => {
    // Scroll to facilities section or navigate to facilities page
    const facilitiesSection = document.getElementById("facilities");
    if (facilitiesSection) {
      facilitiesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">
          Elite Fitness.<br />
          Professional Results.
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl">
          State-of-the-art facilities, certified trainers, and proven methodologies
          designed for serious athletes and fitness professionals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          <button
            onClick={handleStartTraining}
            className="bg-white text-black px-8 py-4 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            {status === "authenticated" ? "Go to Profile" : "Start Training"}
          </button>
          <button
            onClick={handleViewFacilities}
            className="border border-white/20 text-white px-8 py-4 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            View Facilities
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12">
          <div>
            <div className="text-5xl font-bold text-white mb-2">500+</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Active Members</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-white mb-2">50+</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Certified Trainers</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-white mb-2">24/7</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Access Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}
