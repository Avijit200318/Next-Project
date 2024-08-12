import {z} from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .min(10, {message: "Content must be contain atleast 10 charecters"})
    .max(300, {message: "Content must be no longer than 300 charecters"})
})