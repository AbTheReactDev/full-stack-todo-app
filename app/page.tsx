"use client";

import { logoutUser } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user]);
  return (
    <div>
      Name : {user?.name}
      Email : {user?.email}
      <button onClick={handleLogout} >Logout</button>
    </div>
  );
}
