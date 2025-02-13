import { UserModel } from '@/model/AllModels';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';

type Params = Promise<{ id: string; }>
export async function DELETE(
    request: NextRequest,
    { params }: { params: Params }
) {

    const { id } = await params;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;
    
    if (!session || !_user) {
        return Response.json(
            { success: false, messages: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        if (_user.role !== "HR") {
            return Response.json(
                { messages: 'No privilege to delete user', success: false },
                { status: 403 }
            );
        }
        const updateResult = await UserModel.findByIdAndDelete(id);

        if (updateResult === null) {
            return Response.json(
                { messages: 'User not found or already deleted', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { messages: 'Message del', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting message:', error);
        return Response.json(
            { messages: 'Error deleting message', success: false },
            { status: 500 }
        );
    }
}