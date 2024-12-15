import mongoose from 'mongoose';

interface TodoDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
}

const todoSchema = new mongoose.Schema<TodoDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },

}, {
  timestamps: true
});



const Todo = mongoose.models.Todo || mongoose.model<TodoDocument>('Todo', todoSchema);

export default Todo;
