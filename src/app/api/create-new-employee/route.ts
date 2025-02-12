import { NextResponse } from "next/server";
import { UserModel } from "@/model/AllModels";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, email, password, role } = await req.json();

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists with this email",
                },
                { status: 400 }
            );
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                user: { id: newUser._id, username, email, role },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
