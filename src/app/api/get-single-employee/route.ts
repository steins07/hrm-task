import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/AllModels";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { id } = await request.json();

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    messages: "User ID is required",
                }),
                { status: 400 }
            );
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    messages: "User not found",
                }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                messages: user,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return new Response(
            JSON.stringify({
                success: false,
                messages: "An unexpected error occurred",
            }),
            { status: 500 }
        );
    }
}
