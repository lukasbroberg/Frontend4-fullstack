import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { API_BASE_URL } from "../../../config/api";
import CategoryService from "../../../services/categoryService";
import { updateProblem } from "../../../services/problemService";
import { Category } from "../../../types/Category";
import { Problem } from "../../../types/Problem";

/** Edit screen for updating a problem's title, description, and category. */
export default function EditProblem() {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const problem: Problem = JSON.parse(data as string);

  const [title, setTitle] = useState(problem.title);
  const [description, setDescription] = useState(problem.description);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(problem.category);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const { getAllCategories } = CategoryService();
  const imageUri = problem.imageUrl ? `${API_BASE_URL}${problem.imageUrl}` : null;

  useEffect(() => {
    /** Fetches all available categories and stores them in state. */
    const fetchCategories = async () => {
      const result = await getAllCategories();
      setCategories(result);
    };

    fetchCategories();
  }, []);

  /** Saves the updated problem and navigates back to the feed. Alerts on failure. */
  async function handleSave() {
    try {
      await updateProblem(problem.id, title, description, selectedCategory);
      router.replace("/(tabs)/feed" as any);
    } catch (error) {
      console.error("Could not update problem:", error);
      alert("Kunne ikke gemme ændringer. Prøv igen.");
    }
  }

  function DropdownMenu() {
    if (!dropdownOpen) {
      return (
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            selectedCategory ? { backgroundColor: selectedCategory.hexColor } : null,
          ]}
          onPress={() => setDropdownOpen(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.dropdownButtonText}>{selectedCategory?.name ?? "Vælg kategori"}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.dropdownList}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.dropdownItem, { backgroundColor: cat.hexColor }]}
            onPress={() => {
              setSelectedCategory(cat);
              setDropdownOpen(false);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.dropdownItemText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.formContainer} onPress={Keyboard.dismiss}>
            <Stack.Screen options={{ title: "Rediger problem" }} />

            <View style={styles.headerCard}>
              <Text style={styles.title}>Rediger problem</Text>
              <Text style={styles.subtitle}>Opdater titel, kategori og beskrivelse.</Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Titel</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Indtast titel"
                  placeholderTextColor="#94a3b8"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Kategori</Text>
                <DropdownMenu />
              </View>

              {imageUri ? (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Billede</Text>
                  <View style={styles.imagePreviewCard}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => setImageModalVisible(true)}>
                      <Image source={{ uri: imageUri }} style={styles.problemImage} resizeMode="cover" />
                      <View style={styles.imageOverlay}>
                        <Text style={styles.imageOverlayText}>Tryk for at se større</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Beskrivelse</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Beskriv problemet..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.88}>
                <Text style={styles.saveText}>Gem ændringer</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={imageModalVisible} transparent animationType="fade" onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity
            style={styles.imageModalCloseButton}
            onPress={() => setImageModalVisible(false)}
            activeOpacity={0.85}
          >
            <Text style={styles.imageModalCloseText}>Luk</Text>
          </TouchableOpacity>

          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.fullscreenImage} resizeMode="contain" />
          ) : null}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
  },
  formContainer: {
    flexGrow: 1,
  },
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: {
    color: "#0f172a",
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dbe3ef",
    borderRadius: 13,
    paddingVertical: 12,
    paddingHorizontal: 13,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    fontSize: 15,
  },
  textArea: {
    height: 140,
    lineHeight: 21,
  },
  dropdownButton: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#dbe3ef",
    borderRadius: 13,
    paddingVertical: 12,
    paddingHorizontal: 13,
    backgroundColor: "#f8fafc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  dropdownArrow: {
    color: "#64748b",
    fontSize: 11,
    marginLeft: 8,
  },
  dropdownList: {
    gap: 8,
  },
  dropdownItem: {
    borderRadius: 13,
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },
  dropdownItemText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "800",
  },
  imagePreviewCard: {
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  problemImage: {
    width: "100%",
    height: 230,
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
  },
  imageOverlayText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  saveText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.92)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  imageModalCloseButton: {
    position: "absolute",
    top: 55,
    right: 20,
    zIndex: 2,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  imageModalCloseText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  fullscreenImage: {
    width: "100%",
    height: "82%",
  },
});
