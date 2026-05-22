import z from "zod";

export const inviteSchema = z.object({
  inviteAs: z
    .string("Please specify a role for the new member")
    .trim()
    .lowercase()
    .refine((v) => ["admin", "member"].includes(v), {
      message: "Member role should be either admin or member",
    }),
});
