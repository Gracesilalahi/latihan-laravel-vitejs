import React from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
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

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { route } from "ziggy-js"; // <- import Ziggy route helper

export default function Login() {
    const { success, ziggy } = usePage().props; // ambil Ziggy object dari Inertia

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // pakai ziggy sebagai parameter terakhir supaya route() tau semua route Laravel
        post(route("auth.postLogin", {}, false, ziggy), {
            onSuccess: () => reset("password"),
            onError: () => reset("password"),
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
                            Masuk ke Akun Anda
                        </CardTitle>
                        <CardDescription className="
                            text-gray-500
                            leading-relaxed
                            mt-1
                        ">
                            Gunakan email dan kata sandi untuk melanjutkan
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 pb-10">

                        {success && (
                            <div className="mb-6">
                                <Alert className="
                                    border border-green-300
                                    bg-green-50
                                    text-green-700
                                    rounded-xl
                                    shadow-sm
                                ">
                                    <CheckCircle2Icon className="h-5 w-5 text-green-600" />

                                    <AlertTitle className="font-semibold">
                                        Berhasil!
                                    </AlertTitle>

                                    <AlertDescription>
                                        {success}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FieldGroup className="space-y-6">

                                {/* EMAIL */}
                                <Field>
                                    <FieldLabel htmlFor="email" className="text-gray-700 font-medium">
                                        Email
                                    </FieldLabel>

                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
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
                                            transition
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
                                    <FieldLabel htmlFor="password" className="text-gray-700 font-medium">
                                        Kata Sandi
                                    </FieldLabel>

                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
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
                                            disabled:opacity-60
                                        "
                                        disabled={processing}
                                    >
                                        {processing ? "Memproses…" : "Masuk"}
                                    </Button>

                                    <FieldDescription className="text-center mt-4 text-gray-500">
                                        Belum punya akun?{" "}
                                        <Link
                                            href={route("auth.register", {}, false, ziggy)}
                                            className="text-violet-600 hover:text-violet-700 underline font-medium"
                                        >
                                            Daftar di sini
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
