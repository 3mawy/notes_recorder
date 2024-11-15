import { z } from "zod";

export const passwordValidation = z.string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  .regex(/\d/, { message: "Password must contain at least one number." })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character." });
