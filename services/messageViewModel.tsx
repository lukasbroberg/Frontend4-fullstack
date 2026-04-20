import { useState } from "react";
import { Message } from "../types/Message";

const baseURL = "http://localhost:8080";

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
        console.log(data)
        setMessages(data);
        return data;
    }

    return{
        messages,
        setMessages,
        fetchMessagesFromChatId
    }
}