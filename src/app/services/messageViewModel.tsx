import { useState } from "react";
import { Message } from "../types/Message";

export default function useMessageViewModel(){

    const [messages, setMessages] = useState<Message[]>([]);

    async function fetchMessagesFromChatId(chatId: Number){
        const response = await fetch(`http://localhost:8080/api/message/chat/${chatId}`, {
            method: 'GET',
            credentials: 'include' //Uncomment when session and cookies are working

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