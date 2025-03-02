"use client";

import { logoutUser } from "@/redux/authSlice";
import { persistor, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    localStorage.removeItem("auth-token");
    persistor.purge();
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user]);

  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700">My Dashboard</h1>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <img
                src={user.profile_photo || "/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              <span className="font-medium text-gray-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center py-16 px-6">
        <h2 className="text-3xl font-semibold text-gray-800">Welcome, {user?.name || "Guest"}!</h2>
        <p className="text-gray-600 mt-2">This is your dashboard where you can manage everything.</p>
      </main>
    </div>
  );
}
