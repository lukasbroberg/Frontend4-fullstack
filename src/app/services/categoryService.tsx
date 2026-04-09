const API_URL = "http://localhost:8080/api/category/";

export default function CategoryService(){
    
    async function getAllCategories(){
        const response = await fetch(API_URL,{
            method: 'GET',
        })
        if(!response.ok){
            throw new Error("Unable to fetch categories: " + response.status)
        }
        const data = await response.json();
        return data;
    }
    
    return{
        getAllCategories
    }
}