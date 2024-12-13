import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';
import User from '@/models/User';


export async function GET(request: Request) {
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

    const todos = await Todo.find({ userId: user._id });
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const { task } = await request.json();

    if (!task) {
      return NextResponse.json({ message: 'Task is required' }, { status: 400 });
    }

    const newTodo = new Todo({
      userId: user._id,
      task: task.trim(),
      completed: false,
    });

    await newTodo.save();
    return NextResponse.json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}






