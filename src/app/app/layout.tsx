// src/app/app/layout.tsx
import AppLayout from "@/layouts/AppLayout";

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}