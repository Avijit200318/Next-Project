import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import {z} from "zod";
import { usernameValidation } from "@/schemas/singUpSchema";
// if we are using zod then we have to use scema also and we write scema into this


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){

    await dbConnect();

    try{
        // localhost:300/api/checkuserunique?username=hitesh we are using this type of search url to get username
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        // validate with zod
        const result = usernameQuerySchema.safeParse(queryParam);
        console.log("result: ", result);
        if(!result.success){
            const usernameErrors = result.error.format()
            .username?._errors || [];

            return  Response.json({success: false, message: "Invalid query parameters"}, {status: 400});
        }

        const {username} = result.data;
        const existingUser = await UserModel.findOne({username, isVerified: true});

        if(existingUser) {
            return Response.json({success: false, message: "Username is alredy taken"}, {status: 400});
        }

        return Response.json({success: true, message: "Username is unique"}, {status: 201});

    }catch(error){
        console.error("Error checking username", error);
        return Response.json({success: false, message: "Error checking username"}, {status: 500});
    }
}