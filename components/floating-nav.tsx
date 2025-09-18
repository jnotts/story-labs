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
      href: onCreateNew ? undefined : "/create",
      onClick: onCreateNew,
      isActive: activeSection === "create",
    },
    {
      id: "library",
      icon: BookOpen,
      label: "Library",
      href: "/create/library",
      isActive: activeSection === "library",
    },
    {
      id: "profile",
      icon: User,
      label: "Profile",
      href: "/create/profile",
      isActive: activeSection === "profile",
      comingSoon: true,
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      href: "/create/settings",
      isActive: activeSection === "settings",
      comingSoon: true,
    },
  ];

  return <Pillar items={navItems} side="left" />;
}
