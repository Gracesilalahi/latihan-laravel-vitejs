import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
  BarChart3,
  CheckSquare,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/40">
      <Head title="Dashboard" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto py-14 px-6 lg:px-10"
      >
        {/* HEADER */}
        <section className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-indigo-700 tracking-tight drop-shadow-sm"
          >
            🎯 Dashboard Todos
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Selamat datang di pusat kendali aktivitasmu. Pantau progres, lihat
            statistik, dan kelola tugas harianmu dengan tampilan super modern 🔥
          </motion.p>
        </section>

        {/* STAT CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <StatCard
            title="Total Todos"
            value="24"
            icon={<ClipboardList size={26} className="text-indigo-600" />}
            color="from-indigo-100/70 to-white"
          />
          <StatCard
            title="Selesai"
            value="16"
            icon={<CheckSquare size={26} className="text-emerald-600" />}
            color="from-emerald-100/70 to-white"
          />
          <StatCard
            title="Dalam Progres"
            value="6"
            icon={<BarChart3 size={26} className="text-violet-600" />}
            color="from-violet-100/70 to-white"
          />
          <StatCard
            title="Produktivitas"
            value="80%"
            icon={<TrendingUp size={26} className="text-orange-600" />}
            color="from-orange-100/70 to-white"
          />
        </section>

        {/* CTA SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">
            Mulai Kelola Todos 🚀
          </h2>

          <p className="text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Semua aktivitasmu dikumpulkan dalam satu halaman yang rapi dan
            responsif. Yuk mulai produktif hari ini!
          </p>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href={route("todos.index")}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full py-4 px-10 shadow-lg shadow-indigo-300 transition-all"
            >
              📋 Buka Halaman Todos
            </Link>
          </motion.div>
        </motion.section>
      </motion.div>

      <div className="h-20 bg-gradient-to-t from-indigo-100 to-transparent"></div>
    </div>
  );
}

/* REUSABLE COMPONENT */
function StatCard({ title, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`rounded-3xl bg-gradient-to-br ${color} 
      shadow-md border border-white/40 p-8 
      backdrop-blur-sm transition duration-300`}
    >
      <div className="flex items-center justify-between">
        <p className="text-gray-600 font-medium">{title}</p>

        {/* Icon bubble */}
        <div className="p-3 rounded-full bg-white shadow-inner ring-1 ring-gray-200">
          {icon}
        </div>
      </div>

      <h3 className="text-4xl font-extrabold text-gray-800 mt-6 leading-none">
        {value}
      </h3>
    </motion.div>
  );
}
