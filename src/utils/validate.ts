import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Email is invalid"),
  password: z.string().min(8, "Minimum password is 8 character"),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
