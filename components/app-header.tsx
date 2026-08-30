"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { FamilyProfile } from "@/lib/auth";

export default function AppHeader({
  active,
  month,
  familyProfiles,
}: {
  active: "dashboard" | "expenses" | "recommendations";
  month?: string;
  familyProfiles: FamilyProfile[];
}) {
  const [profile, setProfile] = useState("Rosleen");

  useEffect(() => {
    const savedProfile = window.localStorage.getItem("smartmoney-active-profile");
    if (savedProfile && familyProfiles.some((familyProfile) => familyProfile.name === savedProfile)) setProfile(savedProfile);
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
          <label>Active profile<select value={profile} onChange={(event) => changeProfile(event.target.value)}>{familyProfiles.map((familyProfile) => <option key={familyProfile.id} value={familyProfile.name} disabled={!familyProfile.isOwner}>{familyProfile.name}{familyProfile.isOwner ? "" : ` · ${familyProfile.email}`}</option>)}</select></label>
        </div>
      </details>
    </header>
  );
}
