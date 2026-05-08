import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from "../../config/api";
import { addRequirement, getRequirements, Requirement, toggleRequirement } from "../../services/requirementService";
import { Problem } from "../../types/Problem";
import { darken, lighten } from "../../utils/colorTool";

/** Full-page detail view for a single problem. Shows description, image, category, requirements, and chat. */
export default function ProblemDetail(){
    const{data} = useLocalSearchParams();
    const problem: Problem = JSON.parse(data as string);
    const router = useRouter();

    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newRequirement, setNewRequirement] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);

    useEffect(() => {
        fetchRequirements();
    }, []);

    /** Fetches and sets the requirements for the current problem. */
    async function fetchRequirements() {
        try {
            const data = await getRequirements(problem.id);
            setRequirements(data);
        } catch (error) {
            console.error("Could not fetch requirements", error);
        }
    }

    /** Submits a new requirement and refreshes the requirements list. */
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

    /**
     * Toggles the fulfilled state of a requirement.
     * @param requirementId - ID of the requirement to toggle.
     */
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
        <View style={styles.screen}>
            <Stack.Screen options={{ title: problem.title }} />

            <FlatList
                data={[]}
                renderItem={null}
                keyExtractor={(_, index) => index.toString()}
                style={styles.problemList}
                contentContainerStyle={styles.contentContainer}
                ListHeaderComponent={
                    <>
                        <View style={[styles.categoryBadge, {backgroundColor: problem.category ? lighten(problem.category.hexColor) : "lightgray"}]}>
                            <Text style={{color: problem.category ? darken(problem.category.hexColor): 'gray', fontSize: 12}}>
                                {problem.category ? problem.category.name : 'No category'}
                            </Text>
                        </View>

                        <Text style={styles.description}>{problem.description}</Text>

                        {problem.imageUrl ? (
                            <TouchableOpacity
                                style={styles.problemImageContainer}
                                onPress={() => setImageModalVisible(true)}
                                activeOpacity={0.9}
                            >
                                <Image
                                    source={{ uri: `${API_BASE_URL}${problem.imageUrl}` }}
                                    style={styles.problemImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.imageOverlay}>
                                    <Text style={styles.imageOverlayText}>Tryk for at se større</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null}

                        {/* Requirements sektion */}
                        <View style={styles.requirementsCard}>
                            <View style={styles.requirementsHeader}>
                                <View>
                                    <Text style={styles.requirementsTitle}>Krav</Text>
                                    <Text style={styles.requirementsSubtitle}>
                                        {requirements.length === 0
                                            ? "Ingen krav endnu"
                                            : `${requirements.filter(req => req.fulfilled).length}/${requirements.length} gennemført`}
                                    </Text>
                                </View>

                                {problem.createdByCurrentUser && (
                                    <TouchableOpacity
                                        style={styles.addRequirementIconButton}
                                        onPress={() => setModalVisible(true)}
                                        activeOpacity={0.85}
                                    >
                                        <Feather name="plus" size={18} color="#fff" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {requirements.length === 0 ? (
                                <View style={styles.emptyRequirementsBox}>
                                    <Feather name="clipboard" size={20} color="#64748b" />
                                    <Text style={styles.emptyRequirementsText}>Der er ikke tilføjet krav endnu.</Text>
                                </View>
                            ) : (
                                <View style={styles.requirementsList}>
                                    {requirements.map((req) => (
                                        <TouchableOpacity
                                            key={req.id}
                                            style={[
                                                styles.requirementRow,
                                                !problem.createdByCurrentUser && styles.requirementRowReadonly,
                                            ]}
                                            onPress={() => {
                                                if (problem.createdByCurrentUser) {
                                                    handleToggle(req.id);
                                                }
                                            }}
                                            activeOpacity={problem.createdByCurrentUser ? 0.75 : 1}
                                            disabled={!problem.createdByCurrentUser}
                                        >
                                            <View style={[
                                                styles.requirementCheckbox,
                                                req.fulfilled && styles.requirementCheckboxFulfilled,
                                                !problem.createdByCurrentUser && styles.requirementCheckboxReadonly,
                                            ]}>
                                                {req.fulfilled && <Feather name="check" size={13} color="#fff" />}
                                            </View>

                                            <Text style={[styles.requirementText, req.fulfilled && styles.requirementFulfilled]}>
                                                {req.description}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            
                        </View>

                        <Text style={styles.date}>{new Date(problem.createdAt).toLocaleDateString()}</Text>

                        {problem.createdByCurrentUser && (
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => router.push({pathname: 'screens/problem/edit/[id]', params: { id: problem.id, data: JSON.stringify(problem)}} as any)}
                            >
                                <Feather name="edit" size={20} color="#333" />
                                <Text style={styles.editText}>Redigere</Text>
                            </TouchableOpacity>
                        )}
                    </>
                }
            />

            <View style={styles.chatButtonContainer}>
                <TouchableOpacity
                    style={styles.chatButton}
                    onPress={() =>
                        router.push({
                            pathname: `/screens/ChatPage`,
                            params: {
                                id: problem.id.toString(),
                                problemTitle: problem.title,
                            },
                        } as any)
                    }
                >
                    <Feather name="message-circle" size={20} color="#fff" />
                    <Text style={styles.chatButtonText}>Åbn beskeder</Text>
                </TouchableOpacity>
            </View>

            {/* Modal/popup til at tilføje nyt krav */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                {/* Mørk baggrund bag modalen */}
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
                                {/* Viser spinner mens loading, ellers "Gem" tekst */}
                                {loading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={{ color: "#fff" }}>Gem</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={imageModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setImageModalVisible(false)}
            >
                <View style={styles.imageModalOverlay}>
                    <TouchableOpacity
                        style={styles.imageModalCloseButton}
                        onPress={() => setImageModalVisible(false)}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.imageModalCloseText}>Luk</Text>
                    </TouchableOpacity>

                    {problem.imageUrl ? (
                        <Image
                            source={{ uri: `${API_BASE_URL}${problem.imageUrl}` }}
                            style={styles.fullscreenImage}
                            resizeMode="contain"
                        />
                    ) : null}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  problemList: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginBottom: 92,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 24,
  },
  chatButtonContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    },
    imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    },
    imageOverlayText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    },
    imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    },
    imageModalCloseButton: {
    position: 'absolute',
    top: 55,
    right: 20,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    },
    imageModalCloseText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    },
    fullscreenImage: {
    width: '100%',
    height: '82%',
    },
  problemImage: {
    width: '100%',
    height: '100%',
  },
  requirementsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  requirementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  requirementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  requirementsSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
  },
  addRequirementIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requirementsList: {
    gap: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  requirementRowReadonly: {
    opacity: 0.9,
  },
  requirementCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  requirementCheckboxFulfilled: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  requirementCheckboxReadonly: {
    borderColor: '#cbd5e1',
  },
  requirementText: {
    fontSize: 15,
    color: '#1f2937',
    flex: 1,
    lineHeight: 20,
  },
  requirementFulfilled: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  emptyRequirementsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyRequirementsText: {
    color: '#64748b',
    fontSize: 14,
    flex: 1,
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
    color: '#944141',
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
  date: {
    fontSize: 12,
    color: 'gray',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  editText: {
    fontSize: 16,
    color: '#333',
  }
});