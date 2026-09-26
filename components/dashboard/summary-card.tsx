"use client";
import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { Info, type LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
export function SummaryCard({
  label,
  value,
  suffix = "",
  note,
  icon: Icon,
  tooltip,
}: {
  label: string;
  value: number;
  suffix?: string;
  note: string;
  icon: LucideIcon;
  tooltip?: string;
}) {
  const [count, setCount] = useState(value);
  const reduced = useReducedMotion();
  useEffect(() => {
    const controls = animate(0, value, {
      duration: reduced ? 0 : 0.4,
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, reduced]);
  return (
    <article className="summary-card">
      <div className="row-between">
        <span>
          {label}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger
                aria-label={`About ${label}`}
                className="tooltip-trigger"
              >
                <Info size={12} />
              </TooltipTrigger>
              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          )}
        </span>
        <Icon size={16} />
      </div>
      <strong>
        {count}
        <span>{suffix}</span>
      </strong>
      <p>{note}</p>
    </article>
  );
}
