import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function Postpone(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const exisitingUserVerifyByUsername = await UserModel.findOne({
            username, isVerified: true
        });

        if (exisitingUserVerifyByUsername) {
            return Response.json({ success: false, message: "Username is already taken" }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json({success: true, message: "User already exsist with this email"}, {status: 400});
            }else{
                const hashedPassword = await bcryptjs.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.veifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashPassword = await bcryptjs.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = await new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                veifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
            })

            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return Response.json({success:false, message: emailResponse.message}, {status: 500});
        }

        return Response.json({success: true, message: "user register successfully, please verify your email"}, {status: 201});

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json({ success: false, message: "Error registering user" }, { status: 500 });
    }
}