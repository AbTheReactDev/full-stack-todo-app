import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const profile_photo = formData.get("profile_photo") as string;

    if (!name || !email || !password || !phone || !address) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    const userExist = await User.findOne({ email }).lean(); // Use `lean()` to improve performance

    if (userExist) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      profile_photo,
    });

    return NextResponse.json(
      { message: "User created successfully.", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in register API:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const profile_photo = formData.get("profile_photo") as string;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const updateData: Partial<typeof user> = {
      name,
      phone,
      address,
      profile_photo,
    };

    // If password is provided, hash it before saving
    // if (password) {
    //   updateData.password = await bcrypt.hash(password, 10);
    // }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    return NextResponse.json(
      { message: "Profile updated successfully.", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
