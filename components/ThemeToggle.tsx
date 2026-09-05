"use client";

import * as React from "react";
import { MoonStar, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        className={cn("size-8 rounded-full", className)}
        aria-label="Toggle theme"
      >
        <SunDim className="size-5!" />
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      className={cn("size-8 rounded-full", className)}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <SunDim className="size-5!" /> : <MoonStar />}
    </Button>
  );
};
