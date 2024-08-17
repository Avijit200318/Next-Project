import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";


export async function POST(request: Request){
    await dbConnect();

    try{
        const {username, code} = await request.json();

        const decodedUsername = decodeURIComponent(username);
        // some times when we get some thing through url then it maybe encoded so if we pass it through to this decodedURIComponents then we get decoded version

        const user = await UserModel.findOne({username: decodedUsername});

        if(!user){
            return Response.json({success: false, message: "User not found"}, {status: 500});
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({success: true, message: "Account veified successfully"}, {status: 200});
        }else if(!isCodeNotExpired){
            return Response.json({success: false, message: "Verification code expire please sign up again"}, {status: 400});
        }else {
            return Response.json({success: false, message: "Incorrect verifiction code"}, {status: 400});
        }
        
    }catch(error){
        console.error("Error veifying user", error);
        return Response.json({success: false, message: "Error verifying user"}, {status: 500});
    }
}