import { z } from "zod";

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface User {
  userId: string;
}

export interface UserProps {
  id: string;
  name: string;
  email: string;
  company_id: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  company_id: string;
  password: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export interface UpdateUserProfilePayload {
  role?: string;
  membership_status?: string;
  is_verified?: boolean;
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
    company_id: z.string().nonempty(),
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
