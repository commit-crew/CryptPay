import * as z from "zod";

export const signinSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const signupSchema = z.object({
  name: z.string().max(50),
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(16, { message: "Password should be less than 16 characters" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, { 
      message: "Password must contain at least one special character" 
    })
});
