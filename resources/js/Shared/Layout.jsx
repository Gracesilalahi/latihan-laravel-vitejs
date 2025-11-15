import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Menu, X, LogOut, Home, CheckSquare } from "lucide-react";

export default function Layout({ children }) {
    const [open, setOpen] = useState(false);

    const logout = () => router.post("/logout");

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-indigo-50/30 text-slate-800">

            {/* NAVBAR */}
            <header
                className="
                fixed inset-x-0 top-0 z-50
                bg-white/70 backdrop-blur-xl
                border-b border-indigo-100/30
                shadow-[0_2px_20px_rgba(139,92,246,0.08)]
                "
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">

                        {/* LEFT */}
                        <div className="flex items-center gap-4">
                            
                            {/* Mobile toggle */}
                            <button
                                className="md:hidden text-indigo-700"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <X size={22} /> : <Menu size={22} />}
                            </button>

                            {/* Logo */}
                            <Link
                                href="/"
                                className="
                                text-xl font-extrabold tracking-tight
                                bg-gradient-to-r from-indigo-600 to-violet-500 
                                bg-clip-text text-transparent
                                drop-shadow-sm
                                "
                            >
                                TodoDash
                            </Link>

                            {/* Desktop Nav */}
                            <nav className="hidden md:flex items-center gap-6 text-sm">
                                <NavItem href="/" icon={<Home size={15} />}>Home</NavItem>
                                <NavItem href="/todos" icon={<CheckSquare size={15} />}>Todos</NavItem>
                            </nav>
                        </div>

                        {/* RIGHT */}
                        <button
                            onClick={logout}
                            className="
                                flex items-center gap-2
                                px-4 py-2 rounded-full text-sm font-medium
                                bg-slate-100 hover:bg-slate-200
                                shadow-sm
                                transition-all active:scale-95
                                group
                            "
                        >
                            <LogOut size={16} className="group-hover:text-red-500 transition" />
                            Logout
                        </button>
                    </div>

                    {/* MOBILE NAV */}
                    {open && (
                        <div className="
                            md:hidden flex flex-col gap-2 pb-4 
                            animate-in slide-in-from-top fade-in
                            bg-white/60 backdrop-blur-lg rounded-xl mt-2
                            border border-indigo-100/40 shadow-md
                            p-3
                        ">
                            <MobileItem href="/" icon={<Home size={16} />}>Home</MobileItem>
                            <MobileItem href="/todos" icon={<CheckSquare size={16} />}>Todos</MobileItem>
                        </div>
                    )}
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 pt-24">
                <div className="max-w-7xl mx-auto px-6 pb-24">
                    <div className="
                        bg-white/90 backdrop-blur-lg 
                        rounded-3xl shadow-xl 
                        border border-indigo-100/40
                        p-6 md:p-10 
                        animate-in fade-in zoom-in-95
                    ">
                        {children}
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="border-t bg-white/70 backdrop-blur-md py-6 mt-10">
                <div className="max-w-7xl mx-auto px-6 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} TodoDash — Praktikum PABWE  
                </div>
            </footer>
        </div>
    );
}

/* -------------------------------------------
   REUSABLE NAV COMPONENTS
------------------------------------------- */

function NavItem({ href, icon, children }) {
    return (
        <Link
            href={href}
            className="
                flex items-center gap-1
                text-slate-600 hover:text-indigo-600
                transition font-medium
            "
        >
            {icon} {children}
        </Link>
    );
}

function MobileItem({ href, icon, children }) {
    return (
        <Link
            href={href}
            className="
                flex items-center gap-2 px-3 py-2 
                rounded-lg hover:bg-indigo-50 
                text-slate-700 active:scale-95 transition
            "
        >
            {icon} {children}
        </Link>
    );
}
