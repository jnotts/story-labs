"use client";

import {
  Volume2,
  // Download,
  Share2,
  Sparkles,
  Search,
  Filter,
  BookOpenText,
  Plus,
} from "lucide-react";
import { Pillar } from "./pillar";

interface ControlPanelProps {
  mode?: "create" | "library";
  isEditing?: boolean;
  onCreateNew?: () => void;
  onVoiceControlsOpen?: () => void;
}

export function ControlPanel({
  mode = "create",
  isEditing = false,
  onCreateNew,
  onVoiceControlsOpen,
}: ControlPanelProps) {
  if (mode === "create") {
    const createControls = [
      ...(isEditing && onCreateNew
        ? [
            {
              id: "new",
              icon: Plus,
              label: "New",
              onClick: onCreateNew,
            },
          ]
        : []),
      {
        id: "voice",
        icon: Volume2,
        label: "Voice",
        onClick: onVoiceControlsOpen || (() => console.log("Voice settings")),
        comingSoon: false,
      },
      {
        id: "enhance",
        icon: Sparkles,
        label: "Enhance",
        onClick: () => console.log("AI enhance"),
        comingSoon: true,
      },
      {
        id: "read",
        icon: BookOpenText,
        label: "Read",
        onClick: () => console.log("Read story"),
        comingSoon: true,
      },
      {
        id: "share",
        icon: Share2,
        label: "Share",
        onClick: () => console.log("Share story"),
        comingSoon: true,
      },
    ];

    return <Pillar items={createControls} side="right" />;
  }

  // Library mode - different controls
  const libraryControls = [
    {
      id: "search",
      icon: Search,
      label: "Search",
      onClick: () => console.log("Search stories"),
      comingSoon: true,
    },
    {
      id: "filter",
      icon: Filter,
      label: "Filter",
      onClick: () => console.log("Filter stories"),
      comingSoon: true,
    },
  ];

  return <Pillar items={libraryControls} side="right" />;
}
