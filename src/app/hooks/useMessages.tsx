import { useState } from "react";
import { API_BASE_URL } from "../config/api";
import { fetchMessagesFromChatId } from "../services/chatService";
import { Message } from "../types/Message";

const baseURL = API_BASE_URL;

export default function useMessages(){

    const [messages, setMessages] = useState<Message[]>([]);

    async function getMessagesFromChat(chatId: number | undefined){

        const data = await fetchMessagesFromChatId(chatId);
        
        //Filter messages and remove null
        var filteredData: Message[] = [];
        for(var i=0; i<data.length; i++){
            if(data[i]==null){
                continue;
            }
            filteredData.push(data[i])
        }

        setMessages(filteredData);
        return filteredData;
    }

    return{
        messages,
        setMessages,
        getMessagesFromChat
    }
}