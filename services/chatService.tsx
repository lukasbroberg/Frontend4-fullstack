import { API_BASE_URL } from "../config/api";

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