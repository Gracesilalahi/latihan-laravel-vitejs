// resources/js/Pages/Todos/_components/TodoForm.jsx
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function TodoForm({ mode = "create", todo = {} }) {
  const [title, setTitle] = useState(todo.title || "");
  const [description, setDescription] = useState(todo.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    const url =
      mode === "edit" ? `/todos/${todo.id}` : "/todos";
    const method = mode === "edit" ? Inertia.put : Inertia.post;

    method(url, { title, description }, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: mode === "edit" ? "Todo diperbarui!" : "Todo ditambahkan!",
          showConfirmButton: false,
          timer: 1800,
        });
      },
      onError: () => {
        Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
      },
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-100 transition-all hover:shadow-2xl"
      >
        <h1 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">
          {mode === "edit" ? "✏️ Edit Todo" : "📝 Tambah Todo Baru"}
        </h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Masukkan judul todo..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Deskripsi
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tulis deskripsi singkat..."
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-transform transform hover:scale-[1.02] ${
            mode === "edit"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          }`}
        >
          {mode === "edit" ? "💾 Simpan Perubahan" : "➕ Tambah Todo"}
        </button>
      </form>
    </div>
  );
}
