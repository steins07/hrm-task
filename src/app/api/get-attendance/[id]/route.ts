import dbConnect from "@/lib/dbConnect";
import { AttendanceModel, UserModel } from "@/model/AllModels";
import { NextRequest } from "next/server";

type Params = Promise<{ id: string; }>
export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
  await dbConnect();
  try {
    const { id } = await params;
    // Find the employee document (replace with actual _id or query as needed)
    const employee = await UserModel.findById(id);

    if (!employee || !employee.attendance || employee.attendance.length === 0) {
      return Response.json(
        { success: false, messages: "No attendance data found.",
          lastAttendance: null
         },
        { status: 200 }
      );
    }

    // Get the last attendance record
    const lastAttendanceId = employee.attendance[employee.attendance.length - 1];
    const lastAttendance = await AttendanceModel.findById(lastAttendanceId);

    // Return the last attendance record as a JSON response
    return Response.json(
      { success: true, lastAttendance },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching last attendance:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
