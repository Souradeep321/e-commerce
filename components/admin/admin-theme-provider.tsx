// components/admin/admin-theme-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AdminTheme = "light" | "dark";

interface AdminThemeContextValue {
  theme: AdminTheme;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

const STORAGE_KEY = "admin-theme";

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  // Server render and first client render must agree, or React throws a
  // hydration mismatch — so we always start at "dark" (matching the
  // approved design) and only correct from localStorage after mount.
  const [theme, setTheme] = useState<AdminTheme>("dark");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
    setHydrated(true);
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next: AdminTheme = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* `hydrated` gate prevents a one-frame flash of the wrong theme
          for returning visitors who previously chose light mode — we'd
          rather render nothing for a tick than show dark-then-flash-light. */}
      <div style={{ visibility: hydrated ? "visible" : "hidden" }}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return ctx;
}