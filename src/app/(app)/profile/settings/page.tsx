"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { clearSession } from "@/features/auth/lib/session-client";
import { Icons } from "@/shared/components/brand/icons";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/lib/utils";

const THEME_KEY = "sikma:theme";

export default function SettingsPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  // Sync the dark-mode toggle with the document + localStorage on mount.
  useEffect(() => {
    const isDark = localStorage.getItem(THEME_KEY) === "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggleDark(value: boolean) {
    setDark(value);
    document.documentElement.classList.toggle("dark", value);
    localStorage.setItem(THEME_KEY, value ? "dark" : "light");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center py-4">
        <button onClick={() => router.back()} aria-label="Kembali" className="text-foreground">
          <Icons.back size={26} weight="bold" />
        </button>
        <h1 className="text-center text-lg font-extrabold">Pengaturan</h1>
        <span className="w-6" />
      </header>

      <div className="flex flex-col gap-6">
        <Group title="Akun">
          <LinkRow icon={Icons.edit} label="Edit Profil" href="/profile/edit" />
          <LinkRow icon={Icons.sparkle} label="Dekorasi Avatar" href="/profile/decoration" />
          <LinkRow icon={Icons.key} label="Ganti Kata Sandi" href="#" />
        </Group>

        <Group title="Preferensi">
          <SwitchRow
            icon={Icons.bell}
            label="Notifikasi"
            checked={notifications}
            onChange={setNotifications}
          />
          <SwitchRow
            icon={Icons.sound}
            label="Efek Suara"
            checked={sound}
            onChange={setSound}
          />
          <SwitchRow
            icon={Icons.moon}
            label="Mode Gelap"
            checked={dark}
            onChange={toggleDark}
          />
          <LinkRow
            icon={Icons.language}
            label="Bahasa"
            value="Indonesia"
            href="#"
          />
        </Group>

        <Group title="Lainnya">
          <LinkRow icon={Icons.privacy} label="Privasi & Keamanan" href="#" />
          <LinkRow icon={Icons.help} label="Bantuan" href="#" />
          <LinkRow icon={Icons.info} label="Tentang SIKMA" value="v0.1.0" href="#" />
        </Group>

        {/* Logout */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center gap-2 rounded-2xl bg-destructive/10 py-3.5 font-extrabold text-destructive transition-colors hover:bg-destructive/15">
              <Icons.logout size={20} weight="bold" /> Keluar
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-xs rounded-3xl text-center">
            <DialogTitle className="text-xl font-extrabold">Keluar Akun</DialogTitle>
            <DialogDescription className="text-base">
              Kamu yakin ingin keluar dari akun ini?
            </DialogDescription>
            <div className="mt-2 flex flex-col gap-2">
              <Button
                onClick={() => {
                  clearSession();
                  router.push("/login");
                }}
                className="h-12 rounded-2xl bg-destructive text-base font-extrabold text-white hover:bg-destructive"
              >
                Keluar
              </Button>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-2 text-base font-extrabold"
                >
                  Batal
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-sm font-bold text-muted-foreground">{title}</h2>
      <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
        {children}
      </div>
    </section>
  );
}

function RowShell({
  icon: Icon,
  label,
  children,
}: {
  icon: (typeof Icons)["bell"];
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
        <Icon size={20} weight="fill" />
      </span>
      <span className="flex-1 font-bold">{label}</span>
      {children}
    </div>
  );
}

function LinkRow({
  icon,
  label,
  value,
  href,
}: {
  icon: (typeof Icons)["bell"];
  label: string;
  value?: string;
  href: string;
}) {
  return (
    <Link href={href} className="block transition-colors hover:bg-muted/50">
      <RowShell icon={icon} label={label}>
        {value && <span className="text-sm text-muted-foreground">{value}</span>}
        <Icons.arrow size={18} weight="bold" className="text-muted-foreground" />
      </RowShell>
    </Link>
  );
}

function SwitchRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: (typeof Icons)["bell"];
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <RowShell icon={icon} label={label}>
      <Switch checked={checked} onCheckedChange={onChange} className={cn("data-[state=checked]:bg-brand")} />
    </RowShell>
  );
}
