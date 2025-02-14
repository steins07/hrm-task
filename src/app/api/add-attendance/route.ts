import dbConnect from "@/lib/dbConnect";
import { AttendanceModel, UserModel } from "@/model/AllModels";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {

    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const _user: User = session?.user as User;

        const { data} = await req.json();
        if (!_user._id || !data) {
            return Response.json(
                {
                    success: false,
                    messages: "Missing required parameters"
                },
                {
                    status: 400
                }
            );
        }
        const userId = _user._id;
        // Create new attendance record
        const newAttendance = await AttendanceModel.create({ userId, checkIn: data.checkIn,checkOut: data.checkOut});

        // Update user attendance array
        await UserModel.findByIdAndUpdate(userId, {
            $push: { attendance: newAttendance._id },
        });

        // Save attendance document
        await newAttendance.save();

        return Response.json(
            {
                success: true,
                messages: "Attendance submitted successfully",
                data: newAttendance,
            },
            {
                status: 200
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                messages: `Internal server error :: addAttendance :: ${error}`,
            },
            {
                status: 500
            }
        );
    }
}
