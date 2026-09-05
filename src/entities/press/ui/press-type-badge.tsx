import { cn } from "@/shared/lib/utils";
import type { PressType } from "../model/types";

const styles: Record<PressType, string> = {
  연맹: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  전남광주:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

interface PressTypeBadgeProps {
  type: PressType;
  className?: string;
}

export const PressTypeBadge = ({ type, className }: PressTypeBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        styles[type],
        className,
      )}
    >
      {type}
    </span>
  );
};
