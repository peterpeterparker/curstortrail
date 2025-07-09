"use client";

import { initJunoClient } from "@/lib/juno";
import { useEffect } from "react";

export function JunoProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initJunoClient();
  }, []);

  return <>{children}</>;
}
