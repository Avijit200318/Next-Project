import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
// for typesafty and suggestion we need this. This ApiResponse check if the response type is correct or not

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'website | Verificaion Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });

        return {success: true, message: "verification email send successfully"};
    }catch(error){
        console.error("Error sending verification email", error);
        return {success: false, message: "Failed to send verification email"};
    }
}