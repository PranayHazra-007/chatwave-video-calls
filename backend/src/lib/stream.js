import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey=process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if(!apiKey || !apiSecret) {
    console.log("STEAM_API_KEY and STEAM_API_SECRET are required");
    process.exit(1);
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);
export const upsertStreamUser= async(userData)=>{
    try{
        await streamClient.upsertUser(userData);
    } catch (error) {
        console.error("Error upserting Stream user:", error);
        throw error;
    }
}
//
export const generateStreamToken = (userId) => {
    try{
        const useIdStr = userId.toString();
    return streamClient.createToken(useIdStr);
    }catch(error){
        console.error("Error generating stream token:", error);
    }
};