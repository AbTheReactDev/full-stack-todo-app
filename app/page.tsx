"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { logoutUser } from "@/redux/authSlice";
import { persistor, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toggleTheme } from "@/redux/themeSlice";
import { Theme } from "@/types/types";
import { useTheme } from "next-themes";

export default function Home() {
  const dispatch = useDispatch();
  const {  setTheme } = useTheme();

  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.theme);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "GET" });
    persistor.purge();
    dispatch(logoutUser());
  };

  const handleTheme = async () => {
    setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)
    dispatch(toggleTheme())
  }

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user]);

  
  return (
    <div className="min-h-screen bg-background text-foreground">
    <nav className="bg-secondary shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Dashboard</h1>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Avatar>
              <AvatarImage src={user.profile_photo || "/default-avatar.png"} alt="Profile" />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.name}</span>

              <Switch
                checked={theme === Theme.DARK}
                onCheckedChange={handleTheme}
              />

            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>

    <main className="flex flex-col items-center justify-center py-16 px-6">
      <h2 className="text-3xl font-semibold">Welcome, {user?.name || "Guest"}!</h2>
      <p className="text-muted-foreground mt-2">
        This is your dashboard where you can manage everything.
      </p>
    </main>
  </div>
  );
}
