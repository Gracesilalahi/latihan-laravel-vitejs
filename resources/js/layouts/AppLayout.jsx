// resources/js/Layouts/AppLayout.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Home, User, Search } from "lucide-react";

/**
 * AppLayout - Modern, animated, defensive React layout for Inertia app.
 * - Uses framer-motion for smooth transitions
 * - Avatar gradient generator (no libs)
 * - Mobile menu + dropdown with keyboard/escape handling
 * - Safe with missing auth prop
 *
 * Replace your current layout with this. Keep your existing Button component.
 */

export default function AppLayout({ children, title = null }) {
  const { props } = usePage();
  const auth = (props && props.auth) || (props && props.user) || null; // defensive
  const username = auth?.user?.name || auth?.name || "User";
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const mobileBtnRef = useRef(null);
  const userBtnRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // small util: generate soft gradient background from string
  const avatarGradient = (name = "") => {
    const s = name.trim().toLowerCase();
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = s.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    const hue1 = Math.abs((hash * 97) % 360);
    const hue2 = (hue1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue1}deg 75% 60%), hsl(${hue2}deg 75% 55%))`;
  };

  // ARIA & keyboard handling
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setUserOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // click outside to close user menu / mobile menu
  useEffect(() => {
    function onDocClick(e) {
      if (userOpen && userMenuRef.current && !userMenuRef.current.contains(e.target) && userBtnRef.current && !userBtnRef.current.contains(e.target)) {
        setUserOpen(false);
      }
      if (menuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && mobileBtnRef.current && !mobileBtnRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [menuOpen, userOpen]);

  // logout action - using router.post recommended for forms
  const handleLogout = (e) => {
    e?.preventDefault();
    // if your route is /logout replace below
    router.post("/auth/logout");
  };

  // motion variants
  const menuVariants = {
    hidden: { opacity: 0, y: -8, pointerEvents: "none" },
    visible: { opacity: 1, y: 0, pointerEvents: "auto" },
    exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.96, y: -6 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } },
    exit: { opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.12 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col">
      {/* NAVBAR */}
      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="backdrop-blur bg-white/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="h-16 flex items-center justify-between gap-4">
              {/* left */}
              <div className="flex items-center gap-6">
                {/* mobile toggle */}
                <button
                  ref={mobileBtnRef}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMenuOpen((s) => !s)}
                  className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg shadow-md" style={{ background: "linear-gradient(135deg,#4f46e5,#06b6d4)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">DelTodos</span>
                </Link>

                {/* desktop nav */}
                <div className="hidden md:flex items-center gap-5 text-sm" role="navigation" aria-label="Main">
                  <Link href="/" className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                    <Home size={14} /> <span>Home</span>
                  </Link>
                  <Link href="/todos" className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                    <span>Todos</span>
                  </Link>
                </div>
              </div>

              {/* right */}
              <div className="flex items-center gap-3">
                {/* search mini */}
                <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full px-3 py-1 shadow-sm">
                  <Search size={14} className="text-slate-400" />
                  <input aria-label="Search" placeholder="Cari aktivitas..." className="bg-transparent focus:outline-none text-sm w-44 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                </div>

                {/* dynamic user area */}
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Hai,</span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{username}</span>
                  </div>

                  <div className="relative">
                    <button
                      ref={userBtnRef}
                      aria-haspopup="true"
                      aria-expanded={userOpen}
                      onClick={() => setUserOpen((s) => !s)}
                      className="w-9 h-9 rounded-full flex items-center justify-center focus:outline-none"
                      title={username}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                        style={{ background: avatarGradient(username) }}
                      >
                        {String(username).trim().charAt(0).toUpperCase() || "U"}
                      </div>
                    </button>

                    <AnimatePresence>
                      {userOpen && (
                        <motion.div
                          ref={userMenuRef}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={dropdownVariants}
                          className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden"
                          role="menu"
                          aria-label="User menu"
                        >
                          <Link href={route ? route("profile") : "/profile"} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Profile</Link>
                          <Link href={route ? route("settings") : "/settings"} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Settings</Link>
                          <div className="border-t border-slate-100 dark:border-slate-700"></div>
                          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900">Logout</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* mobile menu (animated) */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                id="mobile-menu"
                ref={mobileMenuRef}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuVariants}
                className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <div className="px-4 py-3 space-y-1">
                  <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Beranda</Link>
                  <Link href="/todos" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Todos</Link>
                  <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">Profile</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* optional page title area */}
          {title && (
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
            </div>
          )}

          {/* page content */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            {children}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <div>© {new Date().getFullYear()} Delcom Labs. All rights reserved.</div>
          <div>Made with ♥ — Minimal, responsive, modern</div>
        </div>
      </footer>
    </div>
  );
}
