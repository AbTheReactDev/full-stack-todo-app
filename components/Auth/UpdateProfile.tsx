"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { loginUser } from "@/redux/authSlice";

export default function UpdateProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    let profilePictureUrl = "";
    if (profilePhoto) {
      profilePictureUrl = await uploadToCloudinary(profilePhoto);
    }

    const formData = new FormData();
    formData.append("userId", user?._id || "");
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    formData.append("phone", profileData.phone);
    formData.append("address", profileData.address);
    formData.append("profile_photo", profilePictureUrl || "");

    const res = await fetch("/api/auth/register", {
      method: "PUT",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      toast({
        title: "Success",
        description: data.message,
        variant: "default",
      });
      dispatch(loginUser(data.user));
      router.push("/");
    } else {
      toast({
        title: "Error",
        description: data.message,
        variant: "destructive",
      });
      alert(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Card className="max-w-lg w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
            Update Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Profile Photo Preview */}
          <div className="flex justify-center mb-4">
            {preview ? (
              <Image
                src={preview}
                alt="Profile Preview"
                width={100}
                height={100}
                className="rounded-full border-2 border-gray-300 dark:border-gray-600"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                No Image
              </div>
            )}
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Name</Label>
              <Input
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                name="email"
                value={profileData.email}
                onChange={handleChange}
                disabled
                className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">Phone</Label>
              <Input
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Address
              </Label>
              <Input
                name="address"
                value={profileData.address}
                onChange={handleChange}
                className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Profile Photo Upload */}
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Profile Photo
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:bg-blue-500 file:text-white file:hover:bg-blue-600"
              />
            </div>

            {/* Update Button */}
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
