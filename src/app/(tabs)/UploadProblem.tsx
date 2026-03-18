import { router } from "expo-router";
import { useState } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { createProblem } from "../services/problemService";

export default function UploadProblemScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleUpload() {
    try {
      if (!title || !description) {
        alert("Titel og beskrivelse skal udfyldes");
        return;
      }

      await createProblem(title, description);

      setTitle("");
      setDescription("");
      alert("Problem uploaded");

      router.replace("/");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check that backend runs on localhost:8080 and that /problems is open in SecurityConfig.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Titel</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Indtast titel"
      />

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