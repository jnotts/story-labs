"use client";

import { Volume2, Download, Share2, Sparkles, Search, Filter } from "lucide-react";
import { Pillar } from "./pillar";

interface ControlPanelProps {
  mode?: 'create' | 'library';
}

export function ControlPanel({ mode = 'create' }: ControlPanelProps) {
  if (mode === 'create') {
    const createControls = [
      {
        id: 'voice',
        icon: Volume2,
        label: 'Voice',
        onClick: () => console.log('Voice settings')
      },
      {
        id: 'enhance',
        icon: Sparkles,
        label: 'Enhance',
        onClick: () => console.log('AI enhance')
      },
      {
        id: 'export',
        icon: Download,
        label: 'Export',
        onClick: () => console.log('Export story')
      },
      {
        id: 'share',
        icon: Share2,
        label: 'Share',
        onClick: () => console.log('Share story')
      }
    ];

    return <Pillar items={createControls} side="right" />;
  }

  // Library mode - different controls
  const libraryControls = [
    {
      id: 'search',
      icon: Search,
      label: 'Search',
      onClick: () => console.log('Search stories')
    },
    {
      id: 'filter',
      icon: Filter,
      label: 'Filter',
      onClick: () => console.log('Filter stories')
    }
  ];

  return <Pillar items={libraryControls} side="right" />;
}