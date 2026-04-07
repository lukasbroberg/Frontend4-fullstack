import { useState } from "react";
import { Message } from "../types/Message";

export default function useMessageViewModel(){

    const [messages, setMessages] = useState<Message[]>([]);

    async function fetchMessagesFromChatId(chatId: Number){
        const response = await fetch(`http://192.168.1.228:8080/api/message/chat/${chatId}`, {
            method: 'GET',
            credentials: 'include'
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