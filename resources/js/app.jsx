import "../css/app.css";
import "./bootstrap";


import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { InertiaProgress } from "@inertiajs/progress";
import Swal from "sweetalert2";

// Custom ZiggyProvider (dummy wrapper untuk React)
function ZiggyProvider({ children, value }) {
    // value = props.ziggy dari Blade
    return <>{children}</>;
}

// Import semua halaman React secara otomatis
const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });

// Resolver halaman
function resolvePage(name) {
    if (!name) {
        console.warn(
            "⚠️ Laravel tidak mengirimkan nama halaman. Fallback ke Welcome."
        );
        return pages["./Pages/Welcome.jsx"].default;
    }

    const target = `./Pages/${name}.jsx`;
    if (pages[target]) return pages[target].default;

    console.error(`❌ Halaman "${name}" tidak ditemukan.`);
    console.info("📂 Daftar halaman tersedia:", Object.keys(pages));

    return pages["./Pages/Welcome.jsx"].default;
}

// Debug: cek semua halaman yang dikenali Vite
console.log("📂 Daftar halaman React yang terdeteksi oleh Vite:");
for (const path in pages) {
    console.log(
        path,
        "=>",
        pages[path].default.name || "(anonymous component)"
    );
}

// Setup Inertia
createInertiaApp({
    title: (title) => `${title} | Todos Dashboard`,
    resolve: resolvePage,
    setup({ el, App, props }) {
        if (!props?.initialPage?.url) {
            createRoot(el).render(
                <div className="flex justify-center items-center min-h-screen bg-red-50">
                    <p className="text-lg font-bold text-red-600 p-6 border border-red-300 rounded-lg shadow-lg">
                        ⚠️ Initial Page Props Error — Periksa response
                        controller Laravel.
                    </p>
                </div>
            );
            return;
        }

        // Wrapper app untuk SweetAlert dan styling global
        function AppWrapper(wrapperProps) {
            const flash = wrapperProps.initialPage?.props?.flash || {};

            useEffect(() => {
                if (flash.message) {
                    Swal.fire({
                        icon: flash.type || "success",
                        title: flash.message,
                        timer: 1800,
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timerProgressBar: true,
                        background: "#ffffff",
                        color: "#1f2937",
                    });
                }
            }, [flash]);

            return (
                <div className="min-h-screen bg-gray-50 text-gray-800 transition-all duration-300 ease-out">
                    <App {...wrapperProps} />
                </div>
            );
        }

        // Render app pakai custom ZiggyProvider
        createRoot(el).render(
            <ZiggyProvider value={props.ziggy}>
                <AppWrapper {...props} />
            </ZiggyProvider>
        );
    },
});

// Inertia progress bar
InertiaProgress.init({
    color: "#8b5cf6",
    showSpinner: false,
    delay: 120,
});

// Styling glow untuk progress bar
const glow = document.createElement("style");
glow.innerHTML = `
    #nprogress .bar {
        height: 4px !important;
        border-radius: 10px;
        box-shadow: 0 0 10px #8b5cf6, 0 0 20px #a78bfa;
    }
    #nprogress .peg {
        box-shadow: 0 0 12px #a78bfa, 0 0 22px #8b5cf6;
    }
`;
document.head.appendChild(glow);
