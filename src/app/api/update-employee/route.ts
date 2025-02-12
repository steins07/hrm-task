import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/AllModels";

export async function POST(request: Request) {
  await dbConnect();
  const { id, username, email, role } = await request.json();

  try {
    console.log("Received data for update:", { id, username, email, role });

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { username, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
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
