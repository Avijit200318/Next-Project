import mongoose, { Document} from "mongoose";

export interface Message extends Document{
    content: string,
    createdAt: Date
}

const messageSchema: mongoose.Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// user schema

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    veifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    message: Message[]
}

const userSchema: mongoose.Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verifyCode is required"],
    },
    veifyCodeExpiry: {
        type: Date,
        required: [true, "verifyCode Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    message: [messageSchema]
});

const UserModel = mongoose.models.User || mongoose.model<User>("User", userSchema);


export default UserModel;