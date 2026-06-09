"use client";

import { useEffect, useState } from "react";

import { getPointSettings, updatePointSettings, type PointSettings } from "@/features/admin/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type Group = { title: string; desc: string; icon: string; fields: Array<{ key: keyof PointSettings; label: string }> };

const GROUPS: Group[] = [
  {
    title: "Tes Harian (Daily Test)",
    desc: "EXP bonus saat menyelesaikan tes harian pertama kali di hari itu.",
    icon: "🔥",
    fields: [{ key: "dailyTestExp", label: "Bonus EXP harian" }],
  },
  {
    title: "Ranked Match",
    desc: "Hadiah saat menang / kalah di mode ranked. Poin rank menentukan papan peringkat.",
    icon: "🏆",
    fields: [
      { key: "rankedWinExp", label: "EXP menang" },
      { key: "rankedLoseExp", label: "EXP kalah" },
      { key: "rankedWinPoints", label: "Poin rank menang" },
      { key: "rankedLosePoints", label: "Poin rank kalah (dikurangi)" },
      { key: "rankedWinCoins", label: "Koin menang" },
      { key: "rankedLoseCoins", label: "Koin kalah" },
    ],
  },
  {
    title: "Casual Match",
    desc: "Hadiah untuk mode casual (santai). Tidak memengaruhi papan peringkat.",
    icon: "🎮",
    fields: [
      { key: "casualWinExp", label: "EXP menang" },
      { key: "casualLoseExp", label: "EXP kalah" },
      { key: "casualWinCoins", label: "Koin menang" },
      { key: "casualLoseCoins", label: "Koin kalah" },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PointSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getPointSettings().then(setSettings).catch(console.error).finally(() => setLoading(false));
  }, []);

  function setField(key: keyof PointSettings, value: number) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
    setSaved(false);
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await updatePointSettings(settings);
      setSettings(updated);
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Pengaturan Poin</h1>
        <p className="text-sm text-muted-foreground">Atur EXP, poin rank, dan koin yang didapat pemain.</p>
      </div>

      {loading || !settings ? (
        <p className="py-10 text-center text-muted-foreground animate-pulse">Memuat…</p>
      ) : (
        <>
          {GROUPS.map((g) => (
            <section key={g.title} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{g.icon}</span>
                <div>
                  <h2 className="font-extrabold">{g.title}</h2>
                  <p className="text-sm text-muted-foreground">{g.desc}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.fields.map((f) => (
                  <label key={f.key} className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-muted-foreground">{f.label}</span>
                    <Input
                      type="number"
                      min={0}
                      value={settings[f.key]}
                      onChange={(e) => setField(f.key, Number(e.target.value))}
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}

          <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-2xl border border-border bg-card/95 p-4 backdrop-blur">
            {saved && <span className="text-sm font-bold text-green-600">✓ Tersimpan</span>}
            <Button onClick={handleSave} disabled={saving} className="min-w-32">
              {saving ? "Menyimpan…" : "Simpan Perubahan"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
