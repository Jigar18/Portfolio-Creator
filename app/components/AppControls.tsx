"use client";

import { LogOut, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function AppControls() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    fetch("/api/auth/session", { credentials: "include" })
      .then((response) => response.json())
      .then((session: { authenticated?: boolean }) =>
        setIsAuthenticated(Boolean(session.authenticated))
      )
      .catch(() => setIsAuthenticated(false));
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("portfolio-theme", nextTheme);
    setTheme(nextTheme);
  };

  const logout = async () => {
    setLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Unable to log out");
      setIsAuthenticated(false);
      router.replace("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="fixed right-5 top-5 z-[100] flex items-center gap-2 sm:right-7 sm:top-7">
      {isAuthenticated && (
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="control-button"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="h-[21px] w-[21px]" strokeWidth={1.8} />
        </button>
      )}
      <button
        type="button"
        onClick={toggleTheme}
        className="control-button"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <Moon className="h-6 w-6" fill="currentColor" strokeWidth={1.4} />
        ) : (
          <span className="theme-sun" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
