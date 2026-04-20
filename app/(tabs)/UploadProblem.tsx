import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SignInBox from "../../components/signInBox";
import { useAuth } from "../../contexts/AuthContext";
import CategoryService from "../../services/categoryService";
import { createProblem } from "../../services/problemService";
import { Category } from "../../types/Category";

export default function UploadProblemScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const {getAllCategories} = CategoryService();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const {isAuthenticated, user} = useAuth();

  async function handleUpload() {
    try {
      if (!title || !description) {
        alert("Titel og beskrivelse skal udfyldes");
        return;
      }

      if(!selectedCategory){
        alert("Choose a category");
        return;
      }

      await createProblem(title, description, selectedCategory);

      setTitle("");
      setDescription("");
      alert("Problem uploaded");

      router.replace("/");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check that backend runs on localhost:8080 and that /problems is open in SecurityConfig.");
    }
  }

  useEffect( () => {
    const fetchData = async(): Promise<void> => {
      const categories = await getAllCategories();
      setCategories(categories);
    }
    fetchData();
    
  },[])


  function DropdownMenu(){
    if(!dropdownOpen){
      return(
        <View>
          <TouchableOpacity onPress={() => {dropdownOpen?setDropdownOpen(false): setDropdownOpen(true)}} style={[styles.input, {backgroundColor: selectedCategory?.hexColor}]}>
            <Text>{(selectedCategory?.name==null ?"Choose category": selectedCategory?.name)}</Text>
          </TouchableOpacity>
        </View>
      )
    }
    
    return(
      <View>
        <FlatList data={categories}
                  renderItem={({item}) => (
                    <TouchableOpacity style={[styles.input, {backgroundColor: item.hexColor}]} onPress={() => {
                        dropdownOpen?setDropdownOpen(false): setDropdownOpen(true);
                        setSelectedCategory(item);
                        }}>
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}>
        </FlatList>

      </View>
    )

  }

  //User is not signed in
  if(!isAuthenticated){
    return<SignInBox label="upload a problem"></SignInBox>
  }

  //User is signed in
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Titel</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Indtast titel"
      />
      
      <Text style={styles.label}>Category</Text>
      <View>
        <DropdownMenu />
      </View>

      <Text style={styles.label}>Beskrivelse</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Indtast beskrivelse"
        multiline
      />

      <Button title="Upload problem" onPress={handleUpload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  textArea: {
    height: 100,
  },
});