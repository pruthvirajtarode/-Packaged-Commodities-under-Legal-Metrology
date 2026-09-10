"use client";

import { usePathname } from "next/navigation";

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Landing page gets full width
  if (pathname === "/") {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  // Dashboard pages get max-width and padding
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8 print:p-0 print:max-w-none w-full">
      {children}
    </main>
  );
}
