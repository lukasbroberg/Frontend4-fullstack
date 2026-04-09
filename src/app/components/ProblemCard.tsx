import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { darken, lighten } from "../tools/colorTool";
import { Problem } from "../types/Problem";

type Props = {
  problem: Problem;
  onLikeToggle?: (ProblemId: number) => void;
  onDelete?: (ProblemId: number) => void;
};

export default function ProblemCard({ problem, onLikeToggle, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  function handleDelete() {
    if (Platform.OS === "web") {
      setShowConfirm(true);
    } else {
      Alert.alert(
        "Slet problem",
        "Er du sikker på, at du vil slette dette problem?",
        [
          { text: "Annuller", style: "cancel" },
          { text: "Slet", style: "destructive", onPress: () => onDelete?.(problem.id) },
        ]
      );
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push({pathname: '/problem/[id]', params: {id: problem.id, data: JSON.stringify(problem) } } as any)}>
      {/* Bekræftelsesdialog (web) */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Slet problem</Text>
            <Text style={styles.dialogMessage}>Er du sikker på, at du vil slette dette problem?</Text>
            <View style={styles.dialogButtons}>
              <Pressable style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelText}>Annuller</Text>
              </Pressable>
              <Pressable
                style={styles.confirmBtn}
                onPress={() => { setShowConfirm(false); onDelete?.(problem.id); }}
              >
                <Text style={styles.confirmText}>Slet</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>{problem.title}
        <Text
          style={[
            styles.category,
            {
              backgroundColor: (problem.category ? lighten(problem.category.hexColor) : 'lightgray'),
              color: (problem.category ? darken(problem.category.hexColor) : 'gray'),
            },
          ]}
        >{problem.category ? problem.category.name : 'No category'}</Text>
      </Text>
      <Text
        style={styles.description}
        numberOfLines={2}
      >
        {problem.description}
      </Text>

      <Text style={styles.date}>
        {new Date(problem.createdAt).toLocaleDateString()}
      </Text>

       {/* Like button */}
      <TouchableOpacity
        style={styles.likeButton}
        onPress={() => onLikeToggle?.(problem.id)}
        >
          <Text style={styles.heartIcon}>
            {problem.likedByUser ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.likeCount}>{problem.likeCount}</Text>
      </TouchableOpacity>
      {/* Delete button - kun synlig for ejeren */}
      {problem.createdByCurrentUser && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteText}>🗑️ Slet</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    marginBottom: 8,
  },
  seeMore: {
    color: "#01010a",
    fontWeight: "500", 
    marginTop: 4,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
  likeButton: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 10,
  },
  heartIcon: {
  fontSize: 20,
  marginRight: 5,
  },
  likeCount: {
    fontSize: 14,
    color: "#333",
  },
  deleteButton: {
    marginTop: 8,
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: 300,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dialogMessage: {
    fontSize: 14,
    color: "#444",
    marginBottom: 20,
  },
  dialogButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  confirmBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#e53935",
  },
  confirmText: {
    color: "white",
    fontWeight: "600",
  },
  category: {
    color: 'black',
    marginLeft: 20,
    fontSize: 12,
    textAlign: 'center',
    padding: 5,
    borderRadius: 20,
    fontWeight: 'normal',
  },
});
