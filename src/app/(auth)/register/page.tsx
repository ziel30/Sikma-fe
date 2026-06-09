"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { registerApi } from "@/features/auth/api";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { setSession } from "@/features/auth/lib/session-client";
import { clearOnboarded } from "@/features/onboarding/lib/storage";
import { Mascot } from "@/shared/components/brand/mascot";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { SpeechBubble } from "@/shared/components/brand/speech-bubble";
import { TextField } from "@/features/auth/components/text-field";
import { FieldGroup } from "@/shared/components/ui/field";
import { registerSchema, type RegisterValues } from "@/features/auth/schemas/auth.schema";

export default function RegisterPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setLoading(true);
    try {
      const res = await registerApi({ name: values.name, email: values.email, password: values.password });
      setSession(res.data.accsess_token, res.data.user?.roles ?? 0);
      clearOnboarded(); // new account → run onboarding again (flag is per-browser)
      setDone(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat akun.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  });

  if (done) {
    return (
      <main className="flex flex-1 flex-col items-center px-5 pb-8">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <SpeechBubble className="duration-300 animate-in fade-in zoom-in-95">
            Selamat datang! Profilmu berhasil dibuat.
          </SpeechBubble>
          <Mascot mood="wink" className="size-32 duration-300 animate-in fade-in" />
        </div>
        <div className="sticky bottom-0 w-full max-w-md pt-4">
          <PrimaryButton onClick={() => router.push("/onboarding")}>
            Lanjutkan
          </PrimaryButton>
        </div>
      </main>
    );
  }

  return (
    <AuthShell
      backHref="/"
      title="Buat profil"
      subtitle="Simpan progres belajarmu agar tidak hilang."
      footer={
        <PrimaryButton type="submit" form="register-form" disabled={loading}>
          {loading ? "Memuat..." : "Buat Profil"}
        </PrimaryButton>
      }
    >
      <form id="register-form" onSubmit={onSubmit} noValidate>
        {error && (
          <p className="mb-3 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <FieldGroup className="gap-2">
          <TextField
            id="name"
            label="Nama"
            placeholder="Nama kamu"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <TextField
            id="age"
            label="Umur"
            type="number"
            placeholder="Umur kamu"
            error={errors.age?.message}
            {...register("age", { valueAsNumber: true })}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            placeholder="kamu@email.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextField
            id="password"
            label="Kata sandi"
            type="password"
            placeholder="Minimal 6 karakter"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </FieldGroup>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-bold text-brand hover:underline">
          Masuk
        </Link>
      </p>
    </AuthShell>
  );
}
