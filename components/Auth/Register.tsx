"use client";

import { toast } from "@/hooks/use-toast";
import { uploadToCloudinary } from "@/utils/cloudinary";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function Register() {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    let profilePictureUrl = "";
    // if (profilePhoto) {
    //   profilePictureUrl = await uploadToCloudinary(profilePhoto);
    // }

    const formData = new FormData();
    formData.append("name", registerFormData.name);
    formData.append("email", registerFormData.email);
    formData.append("password", registerFormData.password);
    formData.append("phone", registerFormData.phone);
    formData.append("address", registerFormData.address);
    formData.append("profile_photo", profilePictureUrl || "");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: data.message,
        variant: "destructive",
      });
      alert(data.message)
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen ">
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            value={registerFormData.name}
            onChange={handleChange}
            name="name"
            placeholder="Enter your name"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={registerFormData.email}
            onChange={handleChange}
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            value={registerFormData.password}
            onChange={handleChange}
            name="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Phone</label>
          <input
            type="text"
            value={registerFormData.phone}
            onChange={handleChange}
            name="phone"
            placeholder="Enter your phone number"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Address Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={registerFormData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Profile Photo Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Profile Photo
          </label>
          <input
            type="file"
            name="profile_photo"
            onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
            className="w-full mt-1 cursor-pointer file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:bg-blue-500 file:text-white file:hover:bg-blue-600"
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Register
        </button>

        {/* Login Link */}
        <div className="text-center pt-5">
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
}
