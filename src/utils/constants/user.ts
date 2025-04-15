import { z } from "zod";

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface User {
  userId: string;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  company_id: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

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
