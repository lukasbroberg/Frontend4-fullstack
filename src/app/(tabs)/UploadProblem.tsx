import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import SignInBox from "../components/signInBox";
import { useAuth } from "../hooks/AuthContext";
import useUploadProblem from "../hooks/useUploadProblem";

export default function UploadProblemScreen() {

  const {isAuthenticated, token} = useAuth();
  const {title, description, categories, dropdownOpen, selectedCategory, image,
        setTitle, setDescription, setDropdownOpen, setSelectedCategory, setImage,
        handleUpload, pickImage} = useUploadProblem();

  if (!isAuthenticated) {
    return <SignInBox label="upload a problem" />;
  }

  /** Dropdown menu component for choosing category
   * 
   * @returns the html component structure
   */
  function DropdownMenu() {
    if (!dropdownOpen) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => setDropdownOpen(true)}
            style={[
              styles.input,
              selectedCategory ? { backgroundColor: selectedCategory.hexColor } : null,
            ]}
          >
            <Text>
              {selectedCategory?.name == null ? "Choose category" : selectedCategory.name}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={`${item.name}-${index}`}
            style={[styles.input, styles.dropdownItem, { backgroundColor: item.hexColor }]}
            onPress={() => {
              setDropdownOpen(false);
              setSelectedCategory(item);
            }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  if (!isAuthenticated) {
    return <SignInBox label="upload a problem" />;
  }

  /** Actual UseProblem view
   * 
   */
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <Pressable style={styles.formContainer} onPress={Keyboard.dismiss}>
          <Text style={styles.label}>Titel</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Indtast titel"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
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
            textAlignVertical="top"
          />

          <Text style={styles.label}>Billede</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text>{image ? "Vælg et andet billede" : "Vælg billede"}</Text>
          </TouchableOpacity>

          {image ? (
            <>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
                <Text style={styles.removeImageButtonText}>Fjern billede</Text>
              </TouchableOpacity>
            </>
          ) : null}

          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <Text style={styles.uploadButtonText}>Upload problem</Text>
          </TouchableOpacity>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
  },
  formContainer: {
    flexGrow: 1,
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
  dropdownItem: {
    marginBottom: 6,
  },
  imagePickerButton: {
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
  },
  removeImageButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  removeImageButtonText: {
    color: "white",
    fontWeight: "600",
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "600",
  },
});