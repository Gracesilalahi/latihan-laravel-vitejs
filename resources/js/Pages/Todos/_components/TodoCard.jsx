import React from "react";
import { Link } from "@inertiajs/react";
import { Pencil, Trash2, CheckCircle, Clock } from "lucide-react"; // Import ikon

export default function TodoCard({ todo, onDelete, onEdit }) {
    // Fungsi untuk membersihkan HTML dan memotong teks
    function excerpt(html, length = 100) {
        if (!html) return "Tidak ada deskripsi."; // Menghapus tag HTML
        const text = html.replace(/<[^>]+>/g, ""); // Memotong teks
        return text.length > length ? text.slice(0, length) + "…" : text;
    } // Menentukan gaya berdasarkan status todo

    const isDone = todo?.status === "done";
    const statusClasses = isDone
        ? "bg-emerald-50 text-emerald-700 border-emerald-300" // Pastel Hijau
        : "bg-amber-50 text-amber-700 border-amber-300"; // Pastel Kuning

    return (
        <div
            className={`bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] 
        transition-all duration-300 p-5 flex flex-col border-t-4 ${
                isDone ? "border-emerald-500" : "border-amber-500"
            }`}
        >
                  {/* Header Status & Cover */}     {" "}
            <div className="flex-1">
                        {/* Status Indicator */}       {" "}
                <div
                    className={`text-xs font-semibold uppercase px-3 py-1 rounded-full border mb-3 w-fit ${statusClasses}`}
                >
                              {isDone ? "Selesai" : "Menunggu"}       {" "}
                </div>
                        {/* Cover (Opsional) */}       {" "}
                {todo?.cover_url && (
                    <div className="h-28 w-full overflow-hidden rounded-lg mb-3 bg-gray-50">
                                   {" "}
                        <img
                            src={todo.cover_url}
                            alt={`Gambar todo: ${todo.title}`}
                            className="object-cover h-full w-full"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://placehold.co/400x200/cccccc/ffffff?text=No+Image";
                            }}
                        />
                                 {" "}
                    </div>
                )}
                        {/* Title & Note */}       {" "}
                <h4 className="font-extrabold text-xl text-gray-800 leading-snug">
                              {todo?.title ?? "Tanpa Judul"}       {" "}
                </h4>
                       {" "}
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                              {excerpt(todo?.note)}       {" "}
                </p>
                     {" "}
            </div>
                  {/* Footer Aksi */}     {" "}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        {/* Due Date */}       {" "}
                <div className="flex items-center text-xs text-gray-500 gap-1">
                              <Clock size={14} />         {" "}
                    <span>
                        {todo?.due_date
                            ? `Deadline: ${todo.due_date}`
                            : "Tidak ada batas waktu"}
                    </span>
                           {" "}
                </div>
                        {/* Aksi Tombol (Ikon Minimalis) */}       {" "}
                <div className="flex items-center gap-2">
                             {" "}
                    <button
                        onClick={onEdit}
                        className="text-gray-500 hover:text-indigo-500 p-1 rounded-md transition"
                        title="Edit Todo"
                    >
                                    <Pencil size={18} />         {" "}
                    </button>
                             {" "}
                    <button
                        onClick={onDelete}
                        className="text-gray-500 hover:text-red-500 p-1 rounded-md transition"
                        title="Hapus Todo"
                    >
                                    <Trash2 size={18} />         {" "}
                    </button>
                           {" "}
                </div>
                     {" "}
            </div>
               {" "}
        </div>
    );
}
