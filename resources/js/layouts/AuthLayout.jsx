import React from "react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center p-6">
            
            {/* Glow Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -right-32 w-72 h-72 bg-purple-400/30 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-indigo-400/30 blur-3xl rounded-full"></div>
            </div>

            {/* Auth Card */}
            <main className="relative w-full max-w-xl bg-white/70 backdrop-blur-xl shadow-xl
                             rounded-3xl border border-white/40 p-10 animate-fadeIn">
                {children}
            </main>
        </div>
    );
}
