import { z } from "zod";

export type IUser = {
  id: string;
  name: string;
  email: string;
};

export type User = {
  userId: string;
};

export type GetUser = () => User | undefined;

export const loginSchema = z.object({
  email: z.string().min(5).email(),
  password: z.string().min(5),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().min(5).email(),
    phoneNumber: z.string().nonempty(),
    company: z.string().nonempty(),
    password: z.string().min(5),
    confirmPassword: z.string(),
    agreement: z.literal<boolean>(true),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });
