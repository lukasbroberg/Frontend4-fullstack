import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from "../../config/api";
import ChatScreen from "../screens/chatPage";
import { darken, lighten } from "../tools/colorTool";
import { Problem } from "../types/Problem";

import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, TextInput } from "react-native";
import { addRequirement, getRequirements, Requirement, toggleRequirement } from "../services/requirementService";

export default function ProblemDetail(){
    const{data} = useLocalSearchParams();

    const problem: Problem = JSON.parse(data as string);
    const router = useRouter();

    const [requirements, setRequirements] = useState<Requirement[]>([]);
const [modalVisible, setModalVisible] = useState(false);
const [newRequirement, setNewRequirement] = useState("");
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchRequirements();
}, []);

async function fetchRequirements() {
  try {
    const data = await getRequirements(problem.id);
    setRequirements(data);
  } catch (error) {
    console.error("Could not fetch requirements", error);
  }
}

async function handleAddRequirement() {
  if (!newRequirement.trim()) return;
  setLoading(true);
  try {
    await addRequirement(problem.id, newRequirement);
    setNewRequirement("");
    setModalVisible(false);
    fetchRequirements();
  } catch (error) {
    console.error("Could not add requirement", error);
  } finally {
    setLoading(false);
  }
}

async function handleToggle(requirementId: number) {
  try {
    const updated = await toggleRequirement(problem.id, requirementId);
    setRequirements(prev =>
      prev.map(r => r.id === updated.id ? updated : r)
    );
  } catch (error) {
    console.error("Could not toggle requirement", error);
  }
}

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: problem.title}} />
            <View style={[styles.categoryBadge, {backgroundColor: problem.category ? lighten(problem.category.hexColor) : "lightgray"}]}>
                <Text style={{color: problem.category ? darken(problem.category.hexColor): 'gray', fontSize: 12}}>
                    {problem.category ? problem.category.name : 'No category'}
                </Text>
            </View>

            <Text style={styles.description}>{problem.description}</Text>

            {problem.imageUrl ? (
                <View style={styles.problemImageContainer}>
                    <Image
                          source={{ uri: `${API_BASE_URL}${problem.imageUrl}` }}
                        style={styles.problemImage}
                        resizeMode="contain"
                    />
                </View>
            ) : null}

            {/* Requirements sektion */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Krav</Text>

              {requirements.map((req) => (
                <TouchableOpacity
                  key={req.id}
                  style={styles.requirementRow}
                  onPress={() => handleToggle(req.id)}
                >
                  <Feather
                    name={req.fulfilled ? "check-square" : "square"}
                    size={20}
                    color={req.fulfilled ? "green" : "#333"}
                  />
                  <Text style={[styles.requirementText, req.fulfilled && styles.requirementFulfilled]}>
                    {req.description}
                  </Text>
                </TouchableOpacity>
              ))}

              {problem.createdByCurrentUser && (
                <TouchableOpacity
                  style={styles.addRequirementButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Feather name="plus" size={18} color="#333" />
                  <Text style={styles.addRequirementText}>Tilføj nyt krav +</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Modal */}
            <Modal
              visible={modalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Nyt krav</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Beskriv kravet..."
                    value={newRequirement}
                    onChangeText={setNewRequirement}
                  />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.modalCancel}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text>Annuller</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalSave}
                      onPress={handleAddRequirement}
                    >
                      {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={{ color: "#fff" }}>Gem</Text>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Text style={styles.date}>{new Date(problem.createdAt).toLocaleDateString()}</Text>

            {problem.createdByCurrentUser && (
                <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push({pathname: '/problem/edit/[id]', params: { id: problem.id, data: JSON.stringify(problem)}} as any)}
                >
                    <Feather name="edit" size={20} color="#333" />
                    <Text style={styles.editText}>Redigere</Text>
                </TouchableOpacity>
            )}

            <View>
              <Text style={styles.label}>Beskeder</Text>
              <ChatScreen>
              </ChatScreen>
            </View>
        
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },

  problemImageContainer: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  problemImage: {
    width: '100%',
    height: '100%',
  },

  // --- Requirements & Modal styles ---
  requirementsContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  requirementText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  requirementFulfilled: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  addRequirementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  addRequirementText: {
    fontSize: 15,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  modalInput: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancel: {
    padding: 10,
  },
  modalSave: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  // ---

  date: {
    fontSize: 12,
    color: 'gray',
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap:6,
  },

  editText: {
    fontSize: 16,
    color: '#333',
  },
  label: {
    marginTop: 20
  }
});
