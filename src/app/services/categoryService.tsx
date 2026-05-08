import apiClient from "./apiClient";

export default function CategoryService(){
    
    async function getAllCategories(){
        const response = await apiClient.get("/api/category/");
        return response.data;
    }
    
    return{
        getAllCategories
    }
}