import * as z from "zod";

export const signinSchema = z.object({
  email: z.email(),
  password: z.string(),
});
