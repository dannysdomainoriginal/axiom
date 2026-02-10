import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string("Name field is required")
    .trim()
    .min(3, "Name is too short")
    .refine((val) => val.split(/\s+/).length >= 2, {
      message: "Please enter your full name (first and last)",
    }),

  email: z
    .string("Email field is required")
    .trim()
    .lowercase()
    .email("Please enter a valid email address"),

  password: z
    .string("Password field is required")
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password has exceeded max length"),

  adminInviteToken: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{6}$/.test(v), {
      message: "Invite token must be exactly 6 digits",
    }),
});

export const updateProfileSchema = registerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "No updates were made",
  });

export const loginSchema = z.object({
  email: z
    .string({ error: "Email address is required to login" })
    .trim()
    .lowercase()
    .email("Please enter a valid email address"),

  password: z.string({ error: "Password is required to login" }),
});
