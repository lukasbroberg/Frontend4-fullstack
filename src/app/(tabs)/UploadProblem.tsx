import { useState } from "react";

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
  View
} from "react-native";

import { Feather } from "@expo/vector-icons";
import SignInBox from "../components/signInBox";
import { useAuth } from "../hooks/AuthContext";
import useUploadProblem from "../hooks/useUploadProblem";
import { darken, lighten } from "../utils/colorTool";

export default function UploadProblemScreen() {

  const {isAuthenticated, token} = useAuth();
  const [imageModalVisible, setImageModalVisible] = useState(false);
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
            activeOpacity={0.85}
            style={[
              styles.dropdownButton,
              selectedCategory ? { backgroundColor: lighten(selectedCategory.hexColor) } : null,
            ]}
          >
            <Text style={[
                styles.dropdownButtonText, 
                selectedCategory ? {color: darken(selectedCategory.hexColor)}: null]}>
              {selectedCategory?.name == null ? "Vælg kategori" : selectedCategory.name}
            </Text>
            <Feather name="chevron-down"></Feather>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.dropdownList}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={`${item.name}-${index}`}
            style={[
              styles.dropdownItem,
              item.hexColor ? { backgroundColor: lighten(item.hexColor) } : null
            ]}
            activeOpacity={0.85}
            onPress={() => {
              setDropdownOpen(false);
              setSelectedCategory(item);
            }}
          >
            <Text style={[
              styles.dropdownItemText,
              item.hexColor ? { color: darken(item.hexColor) } : null
            ]}>
              {item.name}</Text>
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
      >
        <Pressable style={styles.formContainer} onPress={Keyboard.dismiss}>
          <View style={styles.headerCard}>
            <Text style={styles.title}>Upload problem</Text>
            <Text style={styles.subtitle}>Del et problem og tilføj detaljer, så andre lettere kan hjælpe.</Text>
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

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Billede</Text>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} activeOpacity={0.85}>
                <Text style={styles.imagePickerButtonText}>{image ? "Vælg et andet billede" : "Vælg billede"}</Text>
              </TouchableOpacity>

              {image ? (
                <View style={styles.imagePreviewCard}>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => setImageModalVisible(true)}>
                    <Image source={{ uri: image.uri }} style={styles.previewImage} resizeMode="cover" />
                    <View style={styles.imageOverlay}>
                      <Text style={styles.imageOverlayText}>Tryk for at se større</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => {
                      setImage(null);
                      setImageModalVisible(false);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.removeImageButtonText}>Fjern billede</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} activeOpacity={0.88}>
              <Text style={styles.uploadButtonText}>Upload problem</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>

      <Modal visible={imageModalVisible} transparent animationType="fade" onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity style={styles.imageModalCloseButton} onPress={() => setImageModalVisible(false)} activeOpacity={0.85}>
            <Text style={styles.imageModalCloseText}>Luk</Text>
          </TouchableOpacity>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.fullscreenImage} resizeMode="contain" />
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
    height: 130,
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
  imagePickerButton: {
    borderWidth: 1,
    borderColor: "#bfdbfe",
    backgroundColor: "#eff6ff",
    borderRadius: 13,
    paddingVertical: 13,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  imagePickerButtonText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "800",
  },
  imagePreviewCard: {
    marginTop: 12,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  previewImage: {
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
  removeImageButton: {
    backgroundColor: "#fef2f2",
    borderTopWidth: 1,
    borderTopColor: "#fecaca",
    padding: 12,
    alignItems: "center",
  },
  removeImageButtonText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "800",
  },
  uploadButton: {
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
  uploadButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
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