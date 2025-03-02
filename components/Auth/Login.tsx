"use client";

import { toast } from "@/hooks/use-toast";
import { loginUser } from "@/redux/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("email", loginFormData.email);
    formData.append("password", loginFormData.password);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log("DATA",data);
    
    if (res.ok) {
      dispatch(loginUser(data.user));
      localStorage.setItem("auth-token", data.token);
      toast({
        title: "Success",
        description: "Login Successful.",
        variant: "default",
      });
      router.push("/");
    } else {
      toast({
        title: "Error",
        description: "Invalid credentials or user not found",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            onChange={handleChange}
            value={loginFormData.email}
            required
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            onChange={handleChange}
            name="password"
            value={loginFormData.password}
            required
            placeholder="Enter your password"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
        <div className="text-center pt-5">
          <Link href="/auth/register">Dont have an account ? Register </Link>
        </div>
      </form>
    </div>
  );
}
