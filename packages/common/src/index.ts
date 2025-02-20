import { z } from "zod";

export const UserSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        email: z
            .string()
            .email("Invalid email format")
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address")
            .optional(),
        phoneNumber: z
            .string()
            .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
            .optional(),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        type: z.enum(["phoneNumber", "email"]),
    })
    .refine(
        (data) => {
            if (data.type === "email") return !!data.email;
            if (data.type === "phoneNumber") return !!data.phoneNumber;
            return false;
        },
        {
            message: "Must provide either email or phoneNumber based on type",
            path: ["type"],
        }
    );

export const OtpSchema = z.object({
    otp: z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d{6}$/, "OTP must contain only numbers (0-9)"),
    phoneNumber: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
        .optional(),
    email: z
        .string()
        .email("Invalid email format")
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address")
        .optional(),
});