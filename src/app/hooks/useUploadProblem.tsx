import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { useAuth } from "../hooks/AuthContext";
import CategoryService from "../services/categoryService";
import { createProblem } from "../services/problemService";
import { Category } from "../types/Category";

export default function useUploadProblem(){
      const [title, setTitle] = useState("");
      const [description, setDescription] = useState("");
      const [categories, setCategories] = useState<Category[]>([]);
      const { getAllCategories } = CategoryService();
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
      const [image, setImage] = useState<any>(null);
    
      const { isAuthenticated } = useAuth();
    
      useEffect(() => {
        const fetchData = async (): Promise<void> => {
          const fetchedCategories = await getAllCategories();
          setCategories(fetchedCategories);
        };
    
        fetchData();
      }, []);
    
      /** Handles uploading the problem to the backend using the upload service
       * 
       * @returns 
       */
      async function handleUpload() {
        try {
    
          if (!title || !description) {
            alert("Titel og beskrivelse skal udfyldes");
            return;
          }
    
          if (!selectedCategory) {
            alert("Choose a category");
            return;
          }
          
          const result = await createProblem(title, description, selectedCategory, image);
    
          setTitle("");
          setDescription("");
          setSelectedCategory(undefined);
          setImage(null);
          alert("Problem uploaded");
    
          router.replace("../(tabs)");
        } catch (error) {
          console.error("Upload failed:", error);
          alert("Upload failed");
        }
      }
    
      /** Pick image locally from file storage of device
       * 
       * @returns nothing, sets the state of current selected image to the image selected from device
       */
      const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
          alert("Du skal give adgang til billeder for at uploade et billede.");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });

        if (!result.canceled) {
          setImage(result.assets[0]);
        }
      };

      return {
        title, description, categories, dropdownOpen, selectedCategory, image,
        setTitle, setDescription, setCategories, setDropdownOpen, setSelectedCategory, setImage,
        handleUpload, pickImage

      }
    
}