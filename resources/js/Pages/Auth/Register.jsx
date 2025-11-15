import React from "react";
import AuthLayout from "@/layouts/AuthLayout";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Link, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function Register() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("auth.postRegister"), {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil 🎉",
                    text: "Akun kamu telah dibuat!",
                    timer: 2000,
                    showConfirmButton: false,
                });

                reset("password", "password_confirmation");
            },

            onError: () => {
                Swal.fire({
                    icon: "error",
                    title: "Gagal 😭",
                    text: "Periksa kembali data kamu.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                reset("password", "password_confirmation");
            },
        });
    };

    return (
        <AuthLayout>
            <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-10 bg-gradient-to-b from-gray-50 to-gray-100">

                <Card className="
                    w-full
                    max-w-[420px]
                    bg-white
                    shadow-xl
                    rounded-3xl
                    border border-gray-200
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:shadow-2xl
                ">
                    <CardHeader className="text-center pt-8 pb-4">
                        <CardTitle className="
                            text-3xl
                            font-extrabold
                            text-gray-800
                            tracking-tight
                        ">
                            Daftar Akun Baru
                        </CardTitle>

                        <CardDescription className="text-gray-500">
                            Ayo mulai kelola aktivitas kamu ✨
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 pb-10">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <FieldGroup className="space-y-6">

                                {/* NAME */}
                                <Field>
                                    <FieldLabel htmlFor="name">
                                        Nama Lengkap
                                    </FieldLabel>

                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Masukkan nama lengkap"
                                        className="
                                            mt-1
                                            rounded-2xl
                                            border-gray-300
                                            w-full
                                            h-12
                                            px-4
                                            text-gray-800
                                            shadow-sm
                                            focus:border-violet-400
                                            focus:ring-violet-400
                                        "
                                        required
                                    />

                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </Field>

                                {/* EMAIL */}
                                <Field>
                                    <FieldLabel htmlFor="email">
                                        Email
                                    </FieldLabel>

                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="contoh@email.com"
                                        className="
                                            mt-1
                                            rounded-2xl
                                            border-gray-300
                                            w-full
                                            h-12
                                            px-4
                                            text-gray-800
                                            shadow-sm
                                            focus:border-violet-400
                                            focus:ring-violet-400
                                        "
                                        required
                                    />

                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </Field>

                                {/* PASSWORD */}
                                <Field>
                                    <FieldLabel htmlFor="password">
                                        Kata Sandi
                                    </FieldLabel>

                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="
                                            mt-1
                                            rounded-2xl
                                            border-gray-300
                                            w-full
                                            h-12
                                            px-4
                                            text-gray-800
                                            shadow-sm
                                            focus:border-violet-400
                                            focus:ring-violet-400
                                        "
                                        required
                                    />

                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </Field>

                                {/* CONFIRM PASSWORD */}
                                <Field>
                                    <FieldLabel htmlFor="password_confirmation">
                                        Konfirmasi Kata Sandi
                                    </FieldLabel>

                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ulangi kata sandi"
                                        className="
                                            mt-1
                                            rounded-2xl
                                            border-gray-300
                                            w-full
                                            h-12
                                            px-4
                                            text-gray-800
                                            shadow-sm
                                            focus:border-violet-400
                                            focus:ring-violet-400
                                        "
                                        required
                                    />

                                    {errors.password_confirmation && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </Field>

                                {/* SUBMIT */}
                                <Field>
                                    <Button
                                        type="submit"
                                        className="
                                            w-full
                                            rounded-2xl
                                            h-12
                                            bg-violet-600
                                            hover:bg-violet-700
                                            text-white
                                            font-semibold
                                            shadow-md
                                            hover:shadow-lg
                                            transition
                                        "
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Memproses…"
                                            : "Daftar Sekarang"}
                                    </Button>

                                    <FieldDescription className="text-center mt-4 text-gray-500">
                                        Sudah punya akun?{" "}
                                        <Link
                                            href={route("auth.login")}
                                            className="text-violet-600 hover:text-violet-700 underline font-medium"
                                        >
                                            Masuk di sini
                                        </Link>
                                    </FieldDescription>
                                </Field>

                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}
