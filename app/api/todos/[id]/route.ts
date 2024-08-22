import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Todo from '../../../../models/Todo';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;
    const { completed } = await request.json();

    const updatedTodo = await Todo.findByIdAndUpdate(id, { completed }, {
        new: true,
    });
    return NextResponse.json(updatedTodo);
}



export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const { id } = params;
    await Todo.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Todo deleted successfully' });
}

