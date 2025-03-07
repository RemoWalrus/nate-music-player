
import React from "react";
import { SidebarProvider as ShadcnSidebarProvider } from "@/components/ui/sidebar";

export function CustomSidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <ShadcnSidebarProvider>
      {children}
    </ShadcnSidebarProvider>
  );
}
