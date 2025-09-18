"use client";

import { BookOpen, User, Settings, PencilLine } from "lucide-react";
import { Pillar } from "./pillar";

interface NavPillarProps {
  activeSection?: "create" | "library" | "profile" | "settings";
  onCreateNew?: () => void;
}

export function NavPillar({ activeSection = "create", onCreateNew }: NavPillarProps) {
  const navItems = [
    {
      id: "create",
      icon: PencilLine,
      label: "Create",
      href: onCreateNew ? undefined : "/protected",
      onClick: onCreateNew,
      isActive: activeSection === "create",
    },
    {
      id: "library",
      icon: BookOpen,
      label: "Library",
      href: "/protected/library",
      isActive: activeSection === "library",
    },
    {
      id: "profile",
      icon: User,
      label: "Profile",
      href: "/protected/profile",
      isActive: activeSection === "profile",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      href: "/protected/settings",
      isActive: activeSection === "settings",
    },
  ];

  return <Pillar items={navItems} side="left" />;
}
