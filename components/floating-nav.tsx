"use client";

import { PlusCircle, BookOpen, User, Settings } from "lucide-react";
import { Pillar } from "./pillar";

interface NavPillarProps {
  activeSection?: 'create' | 'library' | 'profile' | 'settings';
}

export function NavPillar({ activeSection = 'create' }: NavPillarProps) {
  const navItems = [
    {
      id: 'create',
      icon: PlusCircle,
      label: 'Create',
      href: '/protected',
      isActive: activeSection === 'create'
    },
    {
      id: 'library',
      icon: BookOpen,
      label: 'Library',
      href: '/protected/library',
      isActive: activeSection === 'library'
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile',
      href: '/protected/profile',
      isActive: activeSection === 'profile'
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      href: '/protected/settings',
      isActive: activeSection === 'settings'
    }
  ];

  return <Pillar items={navItems} side="left" />;
}