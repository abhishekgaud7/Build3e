import * as React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  const cls = [
    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600",
    className,
  ].filter(Boolean).join(" ");
  return <input ref={ref} className={cls} {...props} />;
});

