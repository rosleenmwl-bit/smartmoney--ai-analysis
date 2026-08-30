"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const familyProfiles = [
  "Rosleen",
  ...Array.from({ length: 10 }, (_, index) => `Family member ${index + 1}`),
];

export default function AppHeader({
  active,
  month,
}: {
  active: "dashboard" | "expenses" | "recommendations";
  month?: string;
}) {
  const [profile, setProfile] = useState("Rosleen");
  const [accessCode, setAccessCode] = useState("");

  useEffect(() => {
    const savedProfile = window.localStorage.getItem("smartmoney-active-profile");
    if (savedProfile && familyProfiles.includes(savedProfile)) setProfile(savedProfile);

    let savedCode = window.localStorage.getItem("smartmoney-family-code");
    if (!savedCode) {
      const values = new Uint16Array(2);
      window.crypto.getRandomValues(values);
      savedCode = `SM-${String(values[0] % 10000).padStart(4, "0")}-${String(values[1] % 10000).padStart(4, "0")}`;
      window.localStorage.setItem("smartmoney-family-code", savedCode);
    }
    setAccessCode(savedCode);
  }, []);

  function changeProfile(nextProfile: string) {
    setProfile(nextProfile);
    window.localStorage.setItem("smartmoney-active-profile", nextProfile);
  }

  return (
    <header className="app-header">
      <Link className="app-brand" href={month ? `/?month=${month}` : "/"} aria-label="SmartMoney dashboard">
        <Image className="exact-logo" src="/smartmoney-logo-exact.png" alt="SmartMoney logo" width={388} height={403} priority />
        <span className="app-brand-copy"><strong>SmartMoney <b>AI</b></strong><small>spend with intention</small></span>
      </Link>
      <nav className="app-nav" aria-label="Main navigation">
        <Link className={active === "dashboard" ? "active" : ""} href={month ? `/?month=${month}` : "/"}>Dashboard</Link>
        <Link className={active === "expenses" ? "active" : ""} href={month ? `/expenses?month=${month}` : "/expenses"}>Expenses</Link>
        <Link className={active === "recommendations" ? "active" : ""} href={month ? `/recommendations?month=${month}` : "/recommendations"}>Recommendations</Link>
      </nav>
      <details className="profile-menu">
        <summary><span className="profile-avatar">{profile.slice(0, 1)}</span><span><strong>{profile}&apos;s profile</strong><small>{profile === "Rosleen" ? "Personal profile" : "Future family profile"}</small></span><span aria-hidden="true">⌄</span></summary>
        <div className="profile-popover">
          <label>Active profile<select value={profile} onChange={(event) => changeProfile(event.target.value)}>{familyProfiles.map((name) => <option key={name} value={name} disabled={name !== "Rosleen"}>{name}{name !== "Rosleen" ? " · future access" : ""}</option>)}</select></label>
          <div className="family-code"><span>Family Access code</span><strong>{accessCode || "Creating…"}</strong><small>Reserved on this device. Secure cross-device sharing will activate with family sign-in.</small></div>
        </div>
      </details>
    </header>
  );
}
