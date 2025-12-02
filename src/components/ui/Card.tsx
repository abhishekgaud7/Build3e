import * as React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const cls = ["rounded-xl border border-gray-200 bg-white shadow-sm", className].filter(Boolean).join(" ");
  return <div className={cls} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const cls = ["p-4 border-b border-gray-100", className].filter(Boolean).join(" ");
  return <div className={cls} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const cls = ["text-lg font-semibold", className].filter(Boolean).join(" ");
  return <h3 className={cls} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const cls = ["text-sm text-gray-500", className].filter(Boolean).join(" ");
  return <p className={cls} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const cls = ["p-4", className].filter(Boolean).join(" ");
  return <div className={cls} {...props} />;
}
