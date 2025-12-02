import * as React from "react";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...props },
  ref
) {
  const cls = [
    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
    "focus:outline-none focus:ring-2 focus:ring-blue-600",
    className,
  ].filter(Boolean).join(" ");
  return (
    <select ref={ref} className={cls} {...props}>
      {children}
    </select>
  );
});
