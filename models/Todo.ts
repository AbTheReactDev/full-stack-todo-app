import mongoose from 'mongoose';

interface TodoDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  task: string;
  completed: boolean;
}

const todoSchema = new mongoose.Schema<TodoDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  task: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add index for faster queries
// This creates a compound index on the userId and completed fields
// The 1 indicates ascending order for both fields
// This index helps optimize queries that filter by userId and completed status
// For example, finding all incomplete todos for a specific user will be faster
todoSchema.index({ userId: 1, completed: 1 });

const Todo = mongoose.models.Todo || mongoose.model<TodoDocument>('Todo', todoSchema);

export default Todo;
