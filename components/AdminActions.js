"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminActions({ ipHash, action, label }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    await fetch("/api/admin/whitelist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ipHash, action }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <button className="btn btn-ghost btn-sm" onClick={go} disabled={busy}>
      {busy ? "…" : label}
    </button>
  );
}
