import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const createTaskSchema = z.object({
  title: z
    .string("Invalid input type for title.")
    .trim()
    .min(1, "Task title is too short")
    .max(120, "Task title is too long"),

  description: z
    .string("Invalid input type for description.")
    .trim()
    .min(5, "Task description is too short")
    .max(2000, "Task description is too long"),

  priority: z.enum(["Low", "Medium", "High"], {
    message: "Invalid task priority",
  }),

  status: z.enum(["Pending", "In Progress", "Completed"], {
    message: "Invalid task status",
  }),

  dueDate: z.iso
    .datetime({ message: "Invalid due date format" })
    .transform((val) => new Date(val)),

  assignedTo: z
    .array(
      z
        .string("Invalid input type for assigned members")
        .refine((val) => isValidObjectId(val), {
          message: "Items in the assignedTo property must be objectIds",
        }),
      { message: "Please assign someone for this task. Use an array of ids" },
    )
    .min(1, "Please assign someone for this task"),

  attachments: z
    .array(z.string("Invalid input type for attachments.").trim().min(1))
    .optional(),

  todoChecklist: z
    .array(
      z.object({
        text: z
          .string("Todo text must be a string")
          .trim()
          .min(1, "Todo text cannot be empty"),
        completed: z.boolean(
          "The completed property must be set to either true or false",
        ),
      }),
    )
    .optional(),

  progress: z
    .number("Invalid input type for progess. Expected type number")
    .min(0, "Progress cannot be less than 0")
    .max(100, "Progress cannot exceed 100")
    .optional(),
});

export const updateTaskSchema = createTaskSchema
  .omit({
    status: true,
    progress: true,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "No updates were made",
  });

export const updateStatusSchema = z
  .object({
    status: z
      .enum(["Pending", "In Progress", "Completed"], {
        message: "Invalid task status",
      })
      .optional(),

    todoChecklist: z
      .array(
        z.object({
          text: z
            .string("Todo text must be a string")
            .trim()
            .min(1, "Todo text cannot be empty"),
          completed: z.boolean(
            "The completed property must be set to either true or false",
          ),
        }),
      )
      .optional(),
  })
  .refine((data) => data.status || data.todoChecklist, {
    message: "No updates were made",
  })
  .refine((data) => !(data.status && data.todoChecklist), {
    message: "Provide either status or todoChecklist, not both",
  });
