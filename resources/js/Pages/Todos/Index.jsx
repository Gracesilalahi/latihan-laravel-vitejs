// resources/js/Pages/Todos/Index.jsx
import React, { useMemo, useEffect, useState } from "react";
import { router, Link, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import ReactApexChart from "react-apexcharts";
import { motion } from "framer-motion";
import TodoCard from "./_components/TodoCard"; // Pastikan path ini benar
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Todos Index (Upgraded - Modern Maximal)
 * - Glassy cards, elegant inputs, pill buttons
 * - Apex donut chart, responsive right column
 * - Framer motion for subtle entrance
 * - Defensive props handling & graceful fallbacks
 *
 * Note:
 * - This file keeps existing router/get/delete logic intact but wrapped with nicer UI.
 * - Ensure tailwind + app layout + framer-motion + apexcharts + sweetalert2 installed.
 */

export default function Index() {
  const { props } = usePage();
  const { todos, filters, stats, flash } = props || {};

  // Filters / UI state
  const [searchValue, setSearchValue] = useState(filters?.search ?? "");
  const [statusValue, setStatusValue] = useState(filters?.status ?? "");
  const [isApplying, setIsApplying] = useState(false);

  // Small UX: show toast via SweetAlert when flash present (safe)
  useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: flash.success,
        showConfirmButton: false,
        timer: 2400,
        background: "#ecfdf5",
      });
    } else if (flash?.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: flash.error,
      });
    }
  }, [flash]);

  // Chart options memoized
  const chartOptions = useMemo(
    () => ({
      chart: { id: "todo-donut", toolbar: { show: false }, animations: { enabled: true } },
      labels: ["Selesai", "Belum Selesai"],
      colors: ["#6366f1", "#f59e0b"],
      legend: { position: "bottom", horizontalAlign: "center", fontSize: "13px" },
      dataLabels: { enabled: true, formatter: (val) => `${Math.round(val)}%` },
      tooltip: { y: { formatter: (val) => `${val} tugas` } },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: { offsetY: -6, show: true, fontSize: "14px" },
              value: { fontSize: "18px", fontWeight: 700 },
              total: {
                show: true,
                label: "Total",
                formatter: (w) => {
                  const a = w.globals.series[0] || 0;
                  const b = w.globals.series[1] || 0;
                  return a + b;
                },
              },
            },
          },
        },
      },
      responsive: [{ breakpoint: 640, options: { chart: { width: "100%" }, legend: { position: "bottom" } } }],
    }),
    []
  );

  const chartSeries = useMemo(() => [(stats?.done ?? 0), (stats?.pending ?? 0)], [stats]);

  // filtering handlers
  function handleSearchKey(e) {
    if (e.key === "Enter") applyFilter();
  }

  async function applyFilter() {
    setIsApplying(true);
    try {
      await router.get(
        route("todos.index"),
        { search: searchValue || undefined, status: statusValue || undefined },
        { preserveState: true, replace: true }
      );
    } finally {
      setIsApplying(false);
    }
  }

  function clearFilter() {
    setSearchValue("");
    setStatusValue("");
    router.get(route("todos.index"), {}, { preserveState: true, replace: true });
  }

  // delete handler with SweetAlert confirm
  async function handleDelete(id, title) {
    const { isConfirmed } = await Swal.fire({
      title: `Hapus "${title}"?`,
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (!isConfirmed) return;

    router.delete(route("todos.destroy", id), {
      onError: () => Swal.fire("Gagal", "Terjadi kesalahan.", "error"),
    });
  }

  // data safety
  const items = (todos?.data) || [];
  const currentPage = todos?.current_page ?? 1;
  const lastPage = todos?.last_page ?? 1;
  const hasPrev = !!todos?.prev_page_url;
  const hasNext = !!todos?.next_page_url;

  // small presentational components inside file for cohesion
  const PillButton = ({ children, onClick, primary }) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition shadow-sm ${
        primary ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg" : "bg-white border border-gray-200 text-slate-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );

  const InputSearch = ({ value, onChange, onKeyDown }) => (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-100 rounded-full px-3 py-2 shadow-sm w-full max-w-xl">
      <Search className="text-slate-400" size={16} />
      <input
        aria-label="Cari tugas"
        placeholder="Cari tugas, tekan Enter..."
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="flex-1 bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400"
      />
      {value ? (
        <button
          onClick={() => setSearchValue("")}
          aria-label="Clear search"
          className="text-xs px-2 py-1 rounded-md text-slate-500 hover:bg-slate-100"
        >
          Reset
        </button>
      ) : null}
    </div>
  );

  const EmptyState = () => (
    <div className="lg:col-span-3 text-center bg-white/70 dark:bg-slate-800/60 py-12 rounded-2xl text-slate-500 border border-gray-100 shadow-md">
      <p className="text-xl font-medium">Tidak ada data ditemukan 😢</p>
      <p className="text-sm mt-2">Coba atur ulang filter atau tambahkan tugas baru.</p>
      <div className="mt-6 flex justify-center"><Link href={route("todos.create")} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white shadow">Tambah Todo</Link></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-white/40 to-white/40 p-4 sm:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">📋 Daftar Todos</h1>
          <p className="text-sm text-slate-500">Kelola aktivitasmu — tambah, ubah, hapus, dan pantau progres.</p>
        </div>

        <div className="flex items-center gap-3">
          <PillButton onClick={() => router.visit(route("todos.create"))} primary>
            <Plus size={14} /> Tambah Todo
          </PillButton>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Filter / Search Card */}
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-white/80 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <InputSearch value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onKeyDown={handleSearchKey} />
              </div>

              <div className="w-full md:w-auto flex items-center gap-3">
                <select
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  className="border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200"
                >
                  <option value="">Semua Status</option>
                  <option value="pending">Belum Selesai</option>
                  <option value="done">Selesai</option>
                </select>

                <div className="ml-auto flex gap-2">
                  <PillButton onClick={applyFilter} primary={false}>{isApplying ? "Mencari..." : "Terapkan"}</PillButton>
                  <PillButton onClick={clearFilter}>Reset</PillButton>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cards Grid */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.length > 0 ? (
              items.map((todo) => (
                <motion.div key={todo.id} whileHover={{ y: -6 }} className="relative">
                  <TodoCard
                    todo={todo}
                    onDelete={() => handleDelete(todo.id, todo.title)}
                    onEdit={() => router.visit(route("todos.edit", todo.id))}
                  />
                </motion.div>
              ))
            ) : (
              <EmptyState />
            )}
          </motion.div>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="mt-6 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="text-sm text-slate-600">Halaman {currentPage} dari {lastPage}</div>
              <div className="flex gap-2">
                <button
                  disabled={!hasPrev}
                  onClick={() => hasPrev && router.get(todos.prev_page_url)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${hasPrev ? "bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-700" : "opacity-40 cursor-not-allowed"}`}
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <button
                  disabled={!hasNext}
                  onClick={() => hasNext && router.get(todos.next_page_url)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${hasNext ? "bg-indigo-600 text-white" : "opacity-40 cursor-not-allowed"}`}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Stats & Chart */}
        <aside className="hidden lg:block space-y-6">
          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="bg-white/80 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Ringkasan Status</h3>
            <p className="text-sm text-slate-500 mt-1">Ringkasan singkat aktivitas kamu.</p>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <div className="text-sm text-slate-600">Total Todos</div>
                <div className="text-xl font-extrabold text-indigo-600">{stats?.total ?? 0}</div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <div className="text-sm text-slate-600">Selesai</div>
                <div className="text-xl font-extrabold text-emerald-600">{stats?.done ?? 0}</div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <div className="text-sm text-slate-600">Belum Selesai</div>
                <div className="text-xl font-extrabold text-amber-600">{stats?.pending ?? 0}</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.06 }} className="bg-white/80 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Progress Overview</h3>
            <div className="w-full max-w-xs">
              <ReactApexChart options={chartOptions} series={chartSeries} type="donut" width="100%" />
            </div>
            <div className="mt-3 text-sm text-slate-500">Persentase Selesai vs Belum</div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}

/**
 * Note:
 * - TodoCard component should accept `todo`, `onDelete`, `onEdit` props.
 * - Keep your TodoCard visuals consistent (image cover, badge, truncated desc).
 * - If you get runtime error 'route is not defined', replace `route(...)` calls with string paths (e.g. "/todos").
 */
