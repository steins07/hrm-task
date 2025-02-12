
import dbConnect from "@/lib/dbConnect";
import {LeaveRequestModel} from "@/model/AllModels";

export async function GET() {
  await dbConnect();

  try {
    const leaveRequests = await LeaveRequestModel.find()

    if (!leaveRequests || leaveRequests.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No leave requests found",
        },
        { status: 404 }
      );
    } else {
      return Response.json(
        {
          success: true,
          messages: leaveRequests||[],
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("An unexpected error occurred", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}