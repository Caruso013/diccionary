"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Book, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="flex justify-between items-center place-content-center p-4">
        <Book size={42} color="#999999" />
        <div className="flex items-center gap-4">
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          <Moon size={30} color="#999999" />
        </div>
      </header>
    </>
  );
}
