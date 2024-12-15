import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import User from '@/models/User';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const isUser = await User.findOne({ email: session.user.email });
        if (!isUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const { title, completed } = await request.json();

        const { id } = params;

        if (!id) {
            return NextResponse.json({ message: 'Todo ID is required' }, { status: 400 });
        }

        const isTodo = await Todo.findOne({ _id: id, userId: isUser._id });
        if (!isTodo) {
            return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
        }

        if (title !== undefined) {
            isTodo.title = title.trim();
        }

        if (completed !== undefined) {
            isTodo.completed = completed;
        }
        await isTodo.save();
        return NextResponse.json({ message: "Todo updated successfully", isTodo });
    } catch (error) {
        console.error('Error updating todo:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}



export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const isUser = await User.findOne({ email: session.user.email });
    if (!isUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!id) {
        return NextResponse.json({ message: 'Todo ID is required' }, { status: 400 });
    }

    const isTodo = await Todo.findOneAndDelete({ _id: id, userId: isUser._id });
    if (!isTodo) {
        return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Todo deleted successfully' });
}




