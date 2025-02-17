import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/AllModels";
import { NextRequest } from "next/server";

type Params = { id: string };

export async function GET(request: NextRequest, { params }: { params: Params }) {
    await dbConnect();

    try {
        const { id } = await params;

        if (!id || typeof id !== "string") {
            return Response.json(
                { success: false, messages: "Invalid or missing user ID", data:null },
                { status: 400 }
            );
        }

        const user = await UserModel.findById(id).select("username");
        console.log("User:",user);

        if (!user) {
            return Response.json(
                { success: false, messages: "User not found", data: null },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, messages: "User found", data: user.username },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user:", error);
        return Response.json(
            { success: false, messages: "Internal Server Error", data: null },
            { status: 500 }
        );
    }
}
