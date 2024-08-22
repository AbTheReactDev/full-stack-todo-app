import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';



export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const todos = await Todo.find({ userId: session.user.id });
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  await dbConnect();
  const session  = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { task } = await request.json();
  const newTodo = new Todo({
    userId: session.user.id,
    task,
    completed: false,
  });

  await newTodo.save();
  return NextResponse.json(newTodo);
}
