import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
const variants: Record<string, string> = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
  ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
};
const sizes: Record<string, string> = {
  sm: "h-9 px-3 py-1 text-sm",
  md: "h-10 px-4 py-2",
  lg: "h-11 px-6 py-3 text-base",
};

export function Button({ variant = "default", size = "md", className, ...props }: ButtonProps) {
  const cls = [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
  return <button className={cls} {...props} />;
}

