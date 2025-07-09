"use client";

import { useEffect } from "react";
import { initJunoClient } from "@/lib/juno";

export function JunoProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initJunoClient();
  }, []);

  return <>{children}</>;
} 