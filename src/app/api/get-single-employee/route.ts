import dbConnect from "@/lib/dbConnect";
import { AttendanceModel, UserModel } from "@/model/AllModels";
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
        
        const subordinatesList= await UserModel.find({_id: { $in: user.employees }});

        const leaveRequests = await LeaveRequestModel.find({
            _id: { $in: user.leaveRequests }
        });

        const attendanceData = await AttendanceModel.find({
            _id: { $in: user.attendance }
        })

        return new Response(
            JSON.stringify({
                success: true,
                message: "Leave requests fetched successfully",
                data: {
                    user,
                    leaveRequests,
                    attendanceData,
                    subordinatesList
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