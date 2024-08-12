import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 charecters")
    .max(10, "Username must me no more than 20 charecters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special charecter")

// username contains only letters (both uppercase and lowercase), digits, and underscores

// username only contain one value so we write direct z.  . signUpSchema contain many value
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: "Passwrod must be atleast 6 charecters"})
})