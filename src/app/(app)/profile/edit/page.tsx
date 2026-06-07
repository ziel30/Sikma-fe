"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icons } from "@/shared/components/brand/icons";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { PROFILE } from "@/features/profile/types";
import { cn } from "@/lib/utils";

const TITLES = ["Jack Of All Trade", "Master Angka", "Pemula", "Sang Juara"];

const INITIAL = {
  name: PROFILE.name,
  title: PROFILE.title,
  gender: "none",
  birthdate: "",
  bio: "",
};

const fieldClass =
  "h-12 rounded-xl border-0 bg-amber-100 px-4 text-amber-900 placeholder:text-amber-700/40 focus-visible:ring-amber-400";

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL);

  const dirty = (Object.keys(INITIAL) as (keyof typeof INITIAL)[]).some(
    (k) => form[k] !== INITIAL[k]
  );

  const set =
    (key: keyof typeof INITIAL) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function handleSave() {
    // No backend yet — just return to the profile.
    router.push("/profile");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-8">
      {/* Top bar with save action */}
      <header className="grid grid-cols-[auto_1fr_auto] items-center py-4">
        <button onClick={() => router.back()} aria-label="Kembali" className="text-foreground">
          <Icons.back size={26} weight="bold" />
        </button>
        <h1 className="text-center text-lg font-extrabold">Edit Profil</h1>
        <button
          onClick={handleSave}
          disabled={!dirty}
          className={cn(
            "justify-self-end text-base font-extrabold transition-colors",
            dirty ? "text-brand" : "text-muted-foreground/50"
          )}
        >
          Simpan
        </button>
      </header>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-2 py-3">
        <Image
          src="/Logo.png"
          alt="Avatar"
          width={88}
          height={88}
          className="size-22 rounded-full bg-brand-soft ring-2 ring-brand"
        />
        <button className="text-sm font-bold text-brand">Ganti avatar</button>
      </div>

      {/* Card */}
      <section className="relative isolate mt-6 rounded-3xl bg-amber-50 p-5 pt-8 ring-1 ring-amber-200">
        {/* Dotted texture behind the content */}
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-3xl opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-amber-300) 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
          }}
        />
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-100 px-6 py-1.5 text-sm font-extrabold whitespace-nowrap text-amber-800">
          Edit Profil
        </span>

        <div className="flex flex-col gap-4">
          <Field label="Nama">
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="Nama kamu"
              className={fieldClass}
            />
          </Field>

          <Field label="Gelar">
            <Select value={form.title} onValueChange={(v) => setForm((p) => ({ ...p, title: v }))}>
              <SelectTrigger className={cn(fieldClass, "[&>svg]:text-amber-700")}>
                <span className="flex items-center gap-2 font-bold text-amber-900 italic">
                  <Icons.sparkle size={18} weight="fill" className="text-amber-500" />
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent>
                {TITLES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Dekorasi Avatar">
            <Link
              href="/profile/decoration"
              className="flex h-12 items-center justify-between rounded-xl bg-amber-100 px-4 text-amber-700/70 transition-colors hover:bg-amber-200"
            >
              Belum diatur
              <Icons.arrow size={18} weight="bold" className="text-amber-700" />
            </Link>
          </Field>

          <Field label="Gender">
            <Select value={form.gender} onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}>
              <SelectTrigger className={cn(fieldClass, "[&>svg]:text-amber-700")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak ingin menyebutkan</SelectItem>
                <SelectItem value="male">Laki-laki</SelectItem>
                <SelectItem value="female">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Tanggal Lahir">
            <input
              type="date"
              value={form.birthdate}
              onChange={set("birthdate")}
              className={fieldClass}
            />
          </Field>

          <Field label="Bio">
            <Textarea
              value={form.bio}
              onChange={set("bio")}
              placeholder="Masukkan biomu"
              className={cn(fieldClass, "h-auto min-h-24 py-3")}
            />
          </Field>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="font-extrabold text-amber-900">{label}</Label>
      {children}
    </div>
  );
}
