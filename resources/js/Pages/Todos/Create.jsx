import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Inertia.post(
      "/todos",
      { title, description },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          Swal.fire({
            icon: "success",
            title: "Selesai!",
            text: "Todo baru berhasil ditambahkan 🎉",
            timer: 1500,
            showConfirmButton: false,
          });
          setTitle("");
          setDescription("");
        },
        onError: () => {
          setIsSubmitting(false);
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Terjadi kesalahan saat menyimpan data 😢",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-6">
      <Head title="Tambah Todo" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
            ✨ Todo Baru
          </h1>
          <Link
            href={route("todos.index")}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← Kembali
          </Link>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Judul
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Masukkan judul todo..."
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan detail tugas..."
            />
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
            className={`btn w-full text-white font-semibold rounded-xl ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? "Menyimpan..." : "➕ Tambah Todo"}
          </motion.button>
        </form>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-400 text-sm mt-6"
      >
        Dibuat dengan niat baik 💜
      </motion.p>
    </div>
  );
}
