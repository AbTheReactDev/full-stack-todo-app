"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { toggleTheme } from "@/redux/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function ThemeToggle() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.theme);
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      size="sm"
      className="p-2 bg-primary text-primary-foreground rounded"
      onClick={handleToggleTheme}
    >
      {theme === "dark" ? <MdOutlineDarkMode /> : <MdDarkMode />}
    </Button>
  );
}
