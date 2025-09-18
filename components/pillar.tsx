"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Tooltip } from "./tooltip";

interface PillarItem {
  id: string;
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  comingSoon?: boolean;
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
        {items.map(({ id, icon: Icon, label, href, onClick, isActive, comingSoon }) => {
          const content = (
            <>
              <Icon
                className={`h-4 w-4 flex-shrink-0 transition-opacity ${
                  isActive
                    ? "opacity-100"
                    : "opacity-60 group-hover:opacity-100"
                }`}
              />
            </>
          );

          const sharedClasses = `
            group flex items-center justify-center p-3 rounded-full transition-all duration-300 w-12 h-12
            ${
              isActive
                ? "bg-white/10 shadow-lg"
                : "hover:bg-white/10"
            }
            ${comingSoon ? "opacity-50 cursor-not-allowed" : ""}
          `;

          const element = href && !comingSoon ? (
            <Link
              key={id}
              href={href}
              className={sharedClasses}
              title={label}
            >
              {content}
            </Link>
          ) : (
            <button
              key={id}
              onClick={comingSoon ? undefined : onClick}
              className={sharedClasses}
              title={label}
              disabled={comingSoon}
            >
              {content}
            </button>
          );

          return comingSoon ? (
            <Tooltip key={id} content="Coming Soon">
              <div className="w-full flex justify-center">
                {element}
              </div>
            </Tooltip>
          ) : (
            element
          );
        })}
      </div>
    </aside>
  );
}
