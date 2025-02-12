import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/AllModels";
import { LeaveRequestModel } from "@/model/AllModels";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { id } = await request.json();

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User ID is required",
                }),
                { status: 400 }
            );
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found",
                }),
                { status: 404 }
            );
        }


        const leaveRequests = await LeaveRequestModel.find({
            _id: { $in: user.leaveRequests }
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Leave requests fetched successfully",
                data: {
                    user,
                    leaveRequests
                }
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "An unexpected error occurred",
            }),
            { status: 500 }
        );
    }
}