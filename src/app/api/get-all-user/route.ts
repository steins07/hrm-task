
import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/model/AllModels";



export async function GET() {
  await dbConnect();

  try {
    const users = await UserModel.find().populate('managerId employees attendance leaveRequests')

    if (!users || users.length === 0) {
      return Response.json(
        {
          success: false,
          message: users.length===0?"No messages found":"User not found",
        },
        { status: 404 }
      );
    } else {
      return Response.json(
        {
          success: true,
          messages: users,
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