"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Icons } from "@/shared/components/brand/icons";
import { EmojiAvatar } from "@/shared/components/brand/emoji-avatar";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { getMyProfile, updateProfile, type MyProfile } from "@/features/profile/api";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-12 w-full rounded-xl border-0 bg-amber-100 px-4 text-amber-900 placeholder:text-amber-700/40 focus-visible:ring-amber-400";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile().then((p) => {
      setProfile(p);
      setName(p.name);
      setBio(p.bio === "Belum ada bio" ? "" : p.bio);
    }).catch(console.error);
  }, []);

  const dirty = profile
    ? name !== profile.name || bio !== (profile.bio === "Belum ada bio" ? "" : profile.bio)
    : false;

  async function handleSave() {
    if (!dirty || saving) return;
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ name: name.trim() || undefined, bio: bio.trim() || undefined });
      router.push("/profile");
    } catch {
      setError("Gagal menyimpan. Coba lagi.");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-8">
      <header className="grid grid-cols-[auto_1fr_auto] items-center py-4">
        <button onClick={() => router.back()} aria-label="Kembali" className="text-foreground">
          <Icons.back size={26} weight="bold" />
        </button>
        <h1 className="text-center text-lg font-extrabold">Edit Profil</h1>
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className={cn(
            "justify-self-end text-base font-extrabold transition-colors",
            dirty && !saving ? "text-brand" : "text-muted-foreground/50"
          )}
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </header>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-2 py-3">
        {profile?.avatar ? (
          <EmojiAvatar emoji={profile.avatar.emoji} bg={profile.avatar.bg} className="size-22 text-4xl ring-2 ring-brand" />
        ) : (
          <div className="size-22 rounded-full bg-brand-soft ring-2 ring-brand animate-pulse" />
        )}
        <Link href="/shop" className="text-sm font-bold text-brand">
          Ganti avatar di Shop
        </Link>
      </div>

      <section className="relative isolate mt-6 rounded-3xl bg-amber-50 p-5 pt-8 ring-1 ring-amber-200">
        <span aria-hidden className="absolute inset-0 -z-10 rounded-3xl opacity-50"
          style={{ backgroundImage: "radial-gradient(var(--color-amber-300) 1.5px, transparent 1.5px)", backgroundSize: "16px 16px" }} />
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-100 px-6 py-1.5 text-sm font-extrabold whitespace-nowrap text-amber-800">
          Edit Profil
        </span>

        <div className="flex flex-col gap-4">
          <Field label="Nama">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
              className={fieldClass}
            />
          </Field>

          <Field label="Bio">
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ceritakan sedikit tentang dirimu…"
              className={cn(fieldClass, "h-auto min-h-24 py-3")}
            />
          </Field>

          <Field label="Avatar">
            <Link href="/shop" className="flex h-12 items-center justify-between rounded-xl bg-amber-100 px-4 text-amber-700/70 transition-colors hover:bg-amber-200">
              {profile?.avatar ? `${profile.avatar.emoji} ${profile.avatar.name}` : "Buka Shop"}
              <Icons.arrow size={18} weight="bold" className="text-amber-700" />
            </Link>
          </Field>
        </div>
      </section>

      {error && (
        <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive text-center">
          {error}
        </p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="font-extrabold text-amber-900">{label}</Label>
      {children}
    </div>
  );
}
