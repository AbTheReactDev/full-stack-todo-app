import mongoose, { Document, Model, Schema } from 'mongoose';

// Define an interface representing a document in MongoDB
interface ITodo extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  task: string;
  completed: boolean;
}

// Define the schema corresponding to the document interface
const TodoSchema: Schema<ITodo> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

// Create the model based on the schema and interface
const Todo: Model<ITodo> = mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);

export default Todo;
