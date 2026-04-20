import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
<<<<<<< HEAD:src/app/problem/edit/[id].tsx
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from "../../config/api";
import CategoryService from "../../services/categoryService";
import { updateProblem } from "../../services/problemService";
import { Category } from "../../types/Category";
import { Problem } from "../../types/Problem";
=======
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import CategoryService from "../../../services/categoryService";
import { updateProblem } from "../../../services/problemService";
import { Category } from "../../../types/Category";
import { Problem } from "../../../types/Problem";

>>>>>>> linh-myProblems:app/problem/edit/[id].tsx

export default function EditProblem(){
    const {data} = useLocalSearchParams();
    const router = useRouter();
    const problem: Problem = JSON.parse(data as string);

    const [title, setTitle] = useState(problem.title);
    const [description, setDescription] = useState(problem.description);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category>(problem.category);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { getAllCategories } = CategoryService();

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await getAllCategories();
            setCategories(result);
        };

        fetchCategories();
    }, []);

    async function handleSave() {
        try {
            await updateProblem(problem.id, title, description, selectedCategory);
            router.replace('/(tabs)/feed' as any);
        } catch (error) {
            alert("Kunne ikke gemme ændringer. Prøve igen.");
        }
        
    }
    
    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options ={{title: "Redigere problem"}}/>

            <Text style={styles.label}>Title</Text>
            <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            />

            <Text style={styles.label}>kategori</Text>
            <TouchableOpacity
            style={styles.input}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            >
                <Text>{selectedCategory?.name ?? "vælg kategori"}</Text>
            </TouchableOpacity>

            {dropdownOpen && categories.map((cat) => (
                <TouchableOpacity
                key={cat.id}
                style={[styles.input, {backgroundColor: cat.hexColor }]}
                onPress={() => {setSelectedCategory(cat); setDropdownOpen(false)}}
                >
                    <Text>{cat.name}</Text>
                </TouchableOpacity>
            ))}

            {problem.imageUrl ? (
                <>
                    <Text style={styles.label}>Nuværende billede</Text>
                    <View style={styles.problemImageContainer}>
                        <Image
                            source={{ uri: `${API_BASE_URL}${problem.imageUrl}` }}
                            style={styles.problemImage}
                            resizeMode="contain"
                        />
                    </View>
                </>
            ) : null}


            <Text style={styles.label}>Beskrivelse</Text>
            <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Gem ændringer</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  textArea: {
    height: 150,
  },
  problemImageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  problemImage: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
