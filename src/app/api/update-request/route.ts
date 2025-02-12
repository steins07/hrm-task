import dbConnect from "@/lib/dbConnect";
import { LeaveRequestModel } from "@/model/AllModels";

export async function POST(request: Request) {
    await dbConnect();
    const { id, status } = await request.json();

    try {
        console.log("Received data for update:", { id, status });

        if (!id) {
            return Response.json(
                {
                    success: false,
                    messages: "No update data available is required",
                },
                { status: 400 }
            );
        }

        const updatedUser = await LeaveRequestModel.findByIdAndUpdate(
            id,
            { status},
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    messages: "Leave request not found",
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                messages: "Leave status updated successfully",
                user: updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("An unexpected error occurred", error);
        return Response.json(
            {
                success: false,
                messages: "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}
