import { model, Schema, Document, Model, Types } from "mongoose";

/* -------------------------------------------------------------------------- */
/*                                 INTERFACES                                 */
/* -------------------------------------------------------------------------- */

interface TaskI extends Document {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  teamId: Types.ObjectId;
  dueDate: Date;
  assignedTo: Types.ObjectId[];
  createdBy: Types.ObjectId;
  attachments: string[];
  todoChecklist: Todo[];
  progress: number;
}

interface Todo {
  text: string;
  completed: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              METHODS AND MODEL                             */
/* -------------------------------------------------------------------------- */

interface TaskMethods {}

interface TaskModel extends Model<TaskI, {}, TaskMethods> {}

/* -------------------------------------------------------------------------- */
/*                                   SCHEMAS                                  */
/* -------------------------------------------------------------------------- */

const todoSchema = new Schema<Todo>({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const taskSchema = new Schema<TaskI, TaskModel, TaskMethods>(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    attachments: [
      {
        type: String,
      },
    ],

    todoChecklist: [todoSchema],
    progress: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const Task = model<TaskI, TaskModel>("Task", taskSchema);
export default Task;
