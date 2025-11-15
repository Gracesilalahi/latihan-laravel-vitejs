import React from "react";
import { Link } from "@inertiajs/react";
import { Sparkles, ArrowRightCircle } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/40 flex items-center justify-center px-6 py-16">
      {/* MAIN WRAPPER */}
      <div className="max-w-3xl text-center bg-white/70 backdrop-blur-xl border border-indigo-100 shadow-2xl rounded-3xl p-12 animate-fadeIn">
        
        {/* ICON */}
        <div className="mx-auto mb-6 w-fit p-4 bg-indigo-100 rounded-full shadow-inner ring-1 ring-indigo-200">
          <Sparkles className="text-indigo-600" size={42} />
        </div>

        {/* HEADING */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 tracking-tight mb-4 drop-shadow-sm">
          Selamat Datang! ✨
        </h1>

        {/* SUBTEXT */}
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Aplikasi Todo modern dengan kombinasi <span className="font-semibold text-indigo-600">Laravel + Inertia + React</span>.  
          Semua dibuat biar pengalamanmu lebih smooth, rapi, dan produktif.
        </p>

        {/* CTA BUTTON */}
        <div className="flex justify-center">
          <Link
            href={route("dashboard")}
            className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg shadow-lg shadow-indigo-300 transition-all duration-300 hover:scale-[1.05]"
          >
            Mulai Eksplor
            <ArrowRightCircle
              size={26}
              className="group-hover:translate-x-1 transition-all duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
