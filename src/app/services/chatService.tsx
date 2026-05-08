import { API_BASE_URL } from "../config/api";

/** Gets the chatId from a given problem
 * 
 * @param problemId 
 * @returns 
 */
export async function getChatFromProblemId(problemId: number){

    const response = await fetch(`${API_BASE_URL}/chat/problem/${problemId}`,{
        method: 'GET',
    })

    if(!response.ok){
        throw new Error("Unable to get chatId for the given problem");
    }

    const data = await response.json();

    return parseInt(data.id);
}

/** Fetches all messages from a chat, using HTTP
 * 
 * @param chatId 
 * @returns 
 */
export async function fetchMessagesFromChatId(chatId: number | undefined){

        if(chatId == undefined){
            throw new Error("No given chatId")
        }

        const response = await fetch(`${API_BASE_URL}/api/message/chat/${chatId}`, {
            method: 'GET',
        })

        if(!response.ok){
            throw new Error("Unable to get messages");
        }

        const data = await response.json();
        return data;
}