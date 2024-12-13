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

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const { task, completed } = await request.json();

        const { id } = params;

        if (!id) {
            return NextResponse.json({ message: 'Todo ID is required' }, { status: 400 });
        }

        const todo = await Todo.findOne({ _id: id, userId: user._id });
        if (!todo) {
            return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
        }

        if (task !== undefined) {
            todo.task = task.trim();
        }

        if (completed !== undefined) {
            todo.completed = completed;
        }
        await todo.save();
        return NextResponse.json({ message: "Todo updated successfully", todo });
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

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!id) {
        return NextResponse.json({ message: 'Todo ID is required' }, { status: 400 });
    }

    const todo = await Todo.findOneAndDelete({ _id: id, userId: user._id });
    if (!todo) {
        return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Todo deleted successfully' });
}




