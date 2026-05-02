import { useState } from "react";
import { API_BASE_URL } from "../config/api";
import { Message } from "../types/Message";

const baseURL = API_BASE_URL;

export default function useMessageViewModel(){

    const [messages, setMessages] = useState<Message[]>([]);

    async function fetchMessagesFromChatId(chatId: number | undefined){

        if(chatId == undefined){
            throw new Error("No given chatId")
        }

        const response = await fetch(`${baseURL}/api/message/chat/${chatId}`, {
            method: 'GET',
        })

        if(!response.ok){
            throw new Error("Unable to get messages");
        }

        const data = await response.json();
        
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
        fetchMessagesFromChatId
    }
}