// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import {UserModel} from "@/model/AllModels";
// import { User } from "next-auth";
// import mongoose from "mongoose";


export async function GET() {
  await dbConnect();

//   const session = await getServerSession(authOptions);
//   console.log("session", session);
//   //check session and user available
//   if (!session || !session.user) {
//     return Response.json(
//       {
//         success: false,
//         message: "Not Authenticated",
//       },
//       { status: 401 }
//     );
//   }

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