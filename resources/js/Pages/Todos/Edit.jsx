// resources/js/Pages/Todos/Form.jsx
import React, { useEffect, useRef, useState } from "react";
import { useForm, usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { ArrowLeft, ImageIcon, Trash2 } from "lucide-react";

/**
 * Form.jsx (Modern - Option A)
 * - Replaces Trix with autosize textarea (react-friendly)
 * - Live image preview + remove + size validation (<= 3MB)
 * - Segmented control for status (pending / done)
 * - Uses Inertia useForm with defensive route fallback
 * - Shows SweetAlert on success/error (but form success handled by Inertia callbacks)
 *
 * Usage:
 * - Place this file in your Pages/Todos folder and import from routes accordingly.
 *
 * Notes:
 * - If `route` helper is not available globally (Ziggy), fallback URLs are used.
 * - Keep your controller routes conventional: todos.store, todos.update, todos.index
 */

/* small helper to build route safely */
function safeRoute(name, ...args) {
  try {
    if (typeof route === "function") return route(name, ...args);
  } catch (e) {
    // no-op
  }
  // fallback naive mapping (only for common names used here)
  if (name === "todos.store") return "/todos";
  if (name === "todos.update") return args[0] ? `/todos/${args[0]}` : "/todos";
  if (name === "todos.index") return "/todos";
  return "/";
}

export default function Form() {
  const { props } = usePage();
  const todo = props?.todo || {}; // may be empty for create
  const isEdit = Boolean(todo?.id);

  // Form state with Inertia
  const form = useForm({
    title: todo?.title || "",
    note: todo?.note || "",
    cover: null, // File object
    status: todo?.status || "pending",
    due_date: todo?.due_date ? todo.due_date.split("T")[0] : "",
  });

  // UI local state
  const [coverPreview, setCoverPreview] = useState(todo?.cover_url || null);
  const [coverName, setCoverName] = useState("");
  const [coverTooLarge, setCoverTooLarge] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // refs
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  /* -------------------------
     Autosize textarea helper
     ------------------------- */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    // initially autosize
    autosize(ta);
    // ensure autosize on content mount
    const ro = new ResizeObserver(() => autosize(ta));
    ro.observe(ta);
    return () => ro.disconnect();
  }, []);

  function autosize(el) {
    if (!el) return;
    el.style.height = "auto";
    // small additional clamp to avoid huge height
    const newH = Math.min(el.scrollHeight, 800);
    el.style.height = newH + "px";
  }

  /* -------------------------
     Sync note -> form.data
     ------------------------- */
  function handleNoteChange(e) {
    form.setData("note", e.target.value);
    autosize(e.target);
  }

  /* -------------------------
     File handling (preview + validation)
     ------------------------- */
  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setCoverPreview(todo?.cover_url || null);
      setCoverName("");
      setCoverTooLarge(false);
      form.setData("cover", null);
      return;
    }

    // client validation: 3MB limit
    const MAX_BYTES = 3 * 1024 * 1024;
    if (f.size > MAX_BYTES) {
      setCoverTooLarge(true);
      setCoverPreview(null);
      setCoverName(f.name);
      form.setData("cover", null);
      return;
    } else {
      setCoverTooLarge(false);
    }

    setCoverName(f.name);
    form.setData("cover", f);

    // preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCoverPreview(evt.target.result);
    };
    reader.readAsDataURL(f);
  }

  function removeCover() {
    setCoverPreview(null);
    setCoverName("");
    setCoverTooLarge(false);
    // If editing and server-side cover exists, we still allow clearing by sending null + special flag
    // We'll set a flag field `remove_cover` so backend can handle deletion if needed
    form.setData("cover", null);
    form.setData("remove_cover", true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* -------------------------
     Status segmented control
     ------------------------- */
  const StatusPillLocal = ({ value, current, onClick, label }) => {
    const active = current === value;
    return (
      <button
        type="button"
        onClick={() => onClick(value)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition inline-flex items-center gap-2 ${
          active
            ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow"
            : "bg-white border border-gray-200 text-slate-700 hover:bg-gray-50"
        }`}
      >
        {label}
      </button>
    );
  };

  /* -------------------------
     Submit handler
     ------------------------- */
  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);

    // remove_remove flag not persisted by default; keep consistent
    if (!form.data.remove_cover) form.setData("remove_cover", false);

    const action = isEdit ? safeRoute("todos.update", todo.id) : safeRoute("todos.store");

    // choose method (put for update)
    const options = {
      preserveScroll: true,
      onSuccess: (page) => {
        setSubmitting(false);
        // success handled via flash (backend) -> show SweetAlert
        // but also show immediate success if none
        const s = page.props?.flash?.success;
        if (s) {
          Swal.fire({ toast: true, position: "top-end", icon: "success", title: s, showConfirmButton: false, timer: 2000, background: "#ecfdf5" });
        } else {
          Swal.fire({ icon: "success", title: isEdit ? "Terupdate" : "Tersimpan", text: isEdit ? "Todo berhasil diperbarui." : "Todo berhasil dibuat.", timer: 1600, showConfirmButton: false });
        }
        // navigate back to index
        router.visit(safeRoute("todos.index"));
      },
      onError: (errors) => {
        setSubmitting(false);
        // keep errors in form.errors (Inertia already handles)
        Swal.fire({ icon: "error", title: "Gagal", text: "Periksa kembali input Anda." });
      },
    };

    // For file uploads, use post with FormData via useForm (Inertia handles)
    if (isEdit) {
      form.put(action, options);
    } else {
      form.post(action, options);
    }
  }

  /* -------------------------
     Show server-side validation errors in-friendly UI (optional)
     ------------------------- */
  useEffect(() => {
    if (form.errors && Object.keys(form.errors).length > 0) {
      // focus first error field if present
      const firstKey = Object.keys(form.errors)[0];
      if (firstKey === "title" && textareaRef.current) {
        textareaRef.current.previousElementSibling?.focus?.();
      }
    }
  }, [form.errors]);

  /* -------------------------
     Render
     ------------------------- */
  return (
    <div className="min-h-screen flex items-start justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50/60 via-white/60 to-white/60">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">{isEdit ? "✏️ Edit Todo" : "📝 Tambah Todo Baru"}</h2>
            <p className="text-sm text-slate-500 mt-1">Isi detail tugasmu, tambahkan cover, dan atur tenggat waktu.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href={safeRoute("todos.index")} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm hover:bg-gray-50">
              <ArrowLeft size={14} /> Kembali
            </Link>
          </div>
        </div>

        <form onSubmit={submit} encType="multipart/form-data" className="bg-white dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Judul Aktivitas</label>
            <input
              type="text"
              value={form.data.title}
              onChange={(e) => form.setData("title", e.target.value)}
              placeholder="Masukkan judul aktivitas..."
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-100 transition ${form.errors.title ? "border-rose-500" : "border-gray-200"}`}
              maxLength={255}
              required
            />
            {form.errors.title && <p className="mt-2 text-sm text-rose-600">{form.errors.title}</p>}
          </div>

          {/* Note (autosize textarea) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Catatan</label>
            <textarea
              ref={textareaRef}
              value={form.data.note}
              onChange={handleNoteChange}
              placeholder="Deskripsi singkat, catatan, atau instruksi..."
              className={`w-full min-h-[120px] max-h-[600px] resize-none px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-100 transition ${form.errors.note ? "border-rose-500" : "border-gray-200"}`}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-slate-400">Maks 2000 karakter</div>
              <div className="text-xs text-slate-400">{String(form.data.note || "").length} chars</div>
            </div>
            {form.errors.note && <p className="mt-2 text-sm text-rose-600">{form.errors.note}</p>}
          </div>

          {/* Cover upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Cover (opsional)</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center gap-3 bg-white/70 dark:bg-slate-900/60 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 cursor-pointer hover:bg-gray-50">
                <ImageIcon size={18} className="text-slate-500" />
                <div className="flex-1">
                  <div className="text-sm text-slate-700 dark:text-slate-200">{coverName || "Pilih gambar..."}</div>
                  <div className="text-xs text-slate-400">PNG, JPG — maksimal 3MB</div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              {/* Remove cover button */}
              {coverPreview && (
                <button type="button" onClick={removeCover} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-200 text-sm hover:bg-gray-50">
                  <Trash2 size={14} /> Hapus
                </button>
              )}
            </div>
            {coverTooLarge && <p className="mt-2 text-sm text-rose-600">Ukuran file melebihi 3MB. Kompres atau pilih file lain.</p>}
            {form.errors.cover && <p className="mt-2 text-sm text-rose-600">{form.errors.cover}</p>}

            {/* Preview */}
            {coverPreview ? (
              <div className="mt-4">
                <div className="w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <img src={coverPreview} alt="Cover preview" className="w-full h-48 object-cover" />
                </div>
              </div>
            ) : isEdit && todo?.cover_url ? (
              <div className="mt-4 text-sm text-slate-500">Cover yang tersimpan akan tetap ada kecuali Anda menghapusnya.</div>
            ) : null}
          </div>

          {/* Status and due date row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Status</label>
              <div className="flex gap-2">
                <StatusPillLocal value="pending" current={form.data.status} onClick={(v) => form.setData("status", v)} label="Belum Selesai" />
                <StatusPillLocal value="done" current={form.data.status} onClick={(v) => form.setData("status", v)} label="Selesai" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Tenggat Waktu</label>
              <input
                type="date"
                value={form.data.due_date || ""}
                onChange={(e) => form.setData("due_date", e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href={safeRoute("todos.index")} className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm hover:bg-gray-50">Batal</Link>
            <button
              type="submit"
              disabled={form.processing || submitting || coverTooLarge}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-white font-medium transition ${form.processing || submitting || coverTooLarge ? "opacity-60 cursor-not-allowed bg-indigo-500" : "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg"}`}
            >
              {form.processing || submitting ? (isEdit ? "Menyimpan..." : "Menyimpan...") : (isEdit ? "Update" : "Simpan")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
