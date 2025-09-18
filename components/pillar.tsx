"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface PillarItem {
  id: string;
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface PillarProps {
  items: PillarItem[];
  side: "left" | "right";
  className?: string;
}

export function Pillar({ items, side, className = "" }: PillarProps) {
  const baseClasses = `fixed top-1/2 -translate-y-1/2 z-50 ${className}`;
  const positionClasses = side === "left" ? "left-6" : "right-6";

  return (
    <aside className={`${baseClasses} ${positionClasses}`}>
      <div className="glass-nav w-16 flex flex-col rounded-full p-2 space-y-2">
        {items.map(({ id, icon: Icon, label, href, onClick, isActive }) => {
          const content = (
            <>
              <Icon
                className={`h-5 w-5 transition-opacity ${
                  isActive
                    ? "opacity-100"
                    : "opacity-60 group-hover:opacity-100"
                }`}
              />
              <span
                className={`text-xs transition-opacity ${
                  isActive ? "opacity-100" : "opacity-40 group-hover:opacity-70"
                }`}
              >
                {label}
              </span>
            </>
          );

          const sharedClasses = `
            group flex flex-col items-center gap-2 p-3 rounded-full transition-all duration-300
            ${
              isActive
                ? "bg-white/10 shadow-lg"
                : "hover:bg-white/10 hover:scale-105"
            }
          `;

          if (href) {
            return (
              <Link
                key={id}
                href={href}
                className={sharedClasses}
                title={label}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={id}
              onClick={onClick}
              className={sharedClasses}
              title={label}
            >
              {content}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
