import mongoose from "mongoose";

// when the db is connected then the object we get what is its data type
type ConnectionObject = {
    isConnected?: number
}
// ? because it always did not connect to db so if its connected then it return number

const connection: ConnectionObject = {};

// here void means we dont know what type of thngs it return.
async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("already connected to database");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGO || "");

        connection.isConnected = db.connections[0].readyState;
        // optional line. because we priviously declear it as a number

        console.log("mongodb connected successfully");
    }catch(error){
        console.log("database connection fail ", error);
        process.exit(1);
    }
}

export default dbConnect;