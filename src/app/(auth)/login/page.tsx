"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginApi } from "@/features/auth/api";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { setSession } from "@/features/auth/lib/session-client";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { TextField } from "@/features/auth/components/text-field";
import { FieldGroup } from "@/shared/components/ui/field";
import { loginSchema, type LoginValues } from "@/features/auth/schemas/auth.schema";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginApi({ email: values.identifier, password: values.password });
      setSession(res.data.accsess_token);
      router.push("/learn");
    } catch {
      setError("Email atau kata sandi salah.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <AuthShell
      backHref="/"
      title="Masuk"
      subtitle="Senang melihatmu lagi! Lanjutkan belajar matematika."
      footer={
        <PrimaryButton type="submit" form="login-form" disabled={loading}>
          {loading ? "Memuat..." : "Masuk"}
        </PrimaryButton>
      }
    >
      <form id="login-form" onSubmit={onSubmit} noValidate>
        {error && (
          <p className="mb-3 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <FieldGroup>
          <TextField
            id="identifier"
            label="Email atau nama pengguna"
            placeholder="kamu@email.com"
            autoComplete="username"
            error={errors.identifier?.message}
            {...register("identifier")}
          />
          <TextField
            id="password"
            label="Kata sandi"
            type="password"
            placeholder="Kata sandi"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </FieldGroup>
      </form>

      <Link
        href="#"
        className="mt-4 block text-center text-sm font-medium text-brand hover:underline"
      >
        Lupa kata sandi?
      </Link>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/register" className="font-bold text-brand hover:underline">
          Buat profil
        </Link>
      </p>
    </AuthShell>
  );
}
