
const baseURL = "http://localhost:8080";

export async function getChatFromProblemId(problemId: number){

    const response = await fetch(`${baseURL}/chat/problem/${problemId}`,{
        method: 'GET',
    })

    if(!response.ok){
        throw new Error("Unable to get chatId for the given problem");
    }

    const data = await response.json();

    return parseInt(data.id);
}