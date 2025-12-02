import * as React from "react";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  const cls = [
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    "bg-gray-100 text-gray-800",
    className,
  ].filter(Boolean).join(" ");
  return <span className={cls} {...props} />;
}

