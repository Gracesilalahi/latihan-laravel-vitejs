import React, { useEffect } from "react";
import { useForm, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import "trix/dist/trix.css";
import "trix";

/**
 * 🟢 Todos Form Page (Create + Edit)
 * - Menggunakan Trix Editor untuk catatan
 * - Upload cover image
 * - SweetAlert2 untuk notifikasi
 * - Modern UI style
 */
export default function TodoForm() {
  const { props } = usePage();
  const todo = props.todo || {};
  const isEdit = !!todo.id;

  const form = useForm({
    title: todo.title || "",
    note: todo.note || "",
    cover: null,
    status: todo.status || "pending",
    due_date: todo.due_date ? todo.due_date.split("T")[0] : "",
  });

  // Sinkronisasi trix editor ke form
  useEffect(() => {
    const handler = (event) => {
      const input = document.querySelector("#note");
      if (input) form.setData("note", input.value);
    };

    window.addEventListener("trix-change", handler);

    // isi editor saat edit
    if (todo.note) {
      const input = document.querySelector("#note");
      if (input) input.value = todo.note;
    }

    return () => window.removeEventListener("trix-change", handler);
  }, []);

  // tampilkan notifikasi flash
  useEffect(() => {
    if (props.flash?.success) {
      Swal.fire("Berhasil", props.flash.success, "success");
    } else if (props.flash?.error) {
      Swal.fire("Gagal", props.flash.error, "error");
    }
  }, [props.flash]);

  // fungsi submit
  const submit = (e) => {
    e.preventDefault();

    const action = isEdit
      ? route("todos.update", todo.id)
      : route("todos.store");

    form.post(action, {
      method: isEdit ? "put" : "post",
      onSuccess: () => {
        Swal.fire(
          "Berhasil",
          `Todo berhasil ${isEdit ? "diperbarui" : "ditambahkan"}!`,
          "success"
        );
        if (!isEdit) form.reset();
        router.visit(route("todos.index"));
      },
      onError: () => {
        Swal.fire(
          "Gagal",
          `Tidak dapat ${isEdit ? "memperbarui" : "menambahkan"} todo!`,
          "error"
        );
      },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-5">
        {isEdit ? "✏️ Edit Todo" : "📝 Tambah Todo Baru"}
      </h2>

      <form
        onSubmit={submit}
        encType="multipart/form-data"
        className="bg-white p-6 rounded-2xl shadow space-y-5"
      >
        {/* Judul */}
        <div>
          <label className="block font-medium mb-1">Judul Aktivitas</label>
          <input
            type="text"
            value={form.data.title}
            onChange={(e) => form.setData("title", e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            placeholder="Masukkan judul aktivitas..."
          />
          {form.errors.title && (
            <p className="text-red-600 text-sm mt-1">{form.errors.title}</p>
          )}
        </div>

        {/* Catatan (Trix) */}
        <div>
          <label className="block font-medium mb-1">Catatan</label>
          <input id="note" type="hidden" name="note" value={form.data.note} />
          <trix-editor input="note"></trix-editor>
          {form.errors.note && (
            <p className="text-red-600 text-sm mt-1">{form.errors.note}</p>
          )}
        </div>

        {/* Cover */}
        <div>
          <label className="block font-medium mb-1">Cover</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => form.setData("cover", e.target.files[0])}
          />
          {isEdit && todo.cover_url && (
            <div className="mt-3">
              <img
                src={todo.cover_url}
                alt="Cover"
                className="w-48 h-32 object-cover rounded-lg shadow"
              />
            </div>
          )}
          {form.errors.cover && (
            <p className="text-red-600 text-sm mt-1">{form.errors.cover}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            value={form.data.status}
            onChange={(e) => form.setData("status", e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Tanggal Jatuh Tempo */}
        <div>
          <label className="block font-medium mb-1">Tenggat Waktu</label>
          <input
            type="date"
            value={form.data.due_date}
            onChange={(e) => form.setData("due_date", e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={form.processing}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded shadow hover:opacity-90"
          >
            {isEdit ? "Update" : "Simpan"}
          </button>
          <Link
            href={route("todos.index")}
            className="px-5 py-2 border rounded hover:bg-gray-50"
          >
            Kembali
          </Link>
        </div>
      </form>
    </div>
  );
}
