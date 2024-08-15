import { Message } from "@/models/user.model";
// we import hrer the message type that we previously created so that we dont need to create it again

export interface ApiResponse{
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages: Array<Message>,
}
// ? means its optional response we may or may not send it