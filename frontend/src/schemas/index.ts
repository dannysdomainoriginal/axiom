import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({
      error: (iss) =>
        iss.input === ""
          ? "Email field is required to login"
          : "Please enter a valid email address",
    })
    .trim(),

  password: z
    .string("Invalid input for password")
    .min(1, "Please enter your password")
    .min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === ""
          ? "Name field is required"
          : "Invalid type for name, expected type string",
    })
    .trim()
    .min(3, "Name is too short")
    .refine((val) => val.split(/\s+/).length >= 2, {
      message: "Please enter your full name (first and last)",
    }),

  email: z
    .email({
      error: (iss) =>
        iss.input === ""
          ? "Email field is required"
          : "Please enter a valid email address",
    })
    .trim(),

  password: z
    .string("Invalid input for password")
    .min(1, "Please enter your password")
    .min(8, "Password must be at least 8 characters"),

  adminInviteToken: z
    .string()
    .refine((v) => !v || /^\d{6}$/.test(v), {
      message: "Invite token must be exactly 6 digits",
    })
    .optional(),

  "profile-img": z
    .instanceof(File)
    .superRefine((file, ctx) => {
      if (!file || file.size <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Please upload a profile picture",
        });
      }

      if (file.size >= 5 * 1024 * 1024) {
        return ctx.addIssue({
          code: "custom",
          message: "File size cannot be greater than 5 MB",
        });
      }

      if (
        !["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(
          file.type,
        )
      ) {
        return ctx.addIssue({
          code: "custom",
          message: "Profile picture must be an image",
        });
      }
    })
    .optional(),
});

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Task title must contain at least one character" }),

  description: z.string().min(5, {
    message: "Task description must contain at least one character",
  }),

  priority: z.enum(["Low", "Medium", "High"], {
    message: "Invalid task priority",
  }),

  status: z.enum(["Pending", "In Progress", "Completed"], {
    message: "Invalid task status",
  }),

  dueDate: z.iso.datetime({
    message: "Please enter an ISO date for the dueDate field",
  }),

  assignedTo: z
    .array(z.string().min(1))
    .min(1, "Please assign someone for this task"),

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

  attachments: z
    .array(z.string("Invalid input type for attachments.").trim().min(1))
    .optional(),
});

export const updateTaskSchema = taskSchema.omit({
  status: true,
  todoChecklist: true,
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
export type TaskSchema = z.infer<typeof taskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
