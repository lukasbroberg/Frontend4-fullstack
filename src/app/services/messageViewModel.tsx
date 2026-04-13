import { useState } from "react";
import { Message } from "../types/Message";

const baseURL = "http://localhost:8080";

export default function useMessageViewModel(){

    const [messages, setMessages] = useState<Message[]>([]);

    async function fetchMessagesFromChatId(chatId: Number){
        const response = await fetch(`${baseURL}/api/message/chat/${chatId}`, {
            method: 'GET',
        })
        const data= await response.json();
        setMessages(data);
        return data;
    }

    return{
        messages,
        setMessages,
        fetchMessagesFromChatId
    }
}