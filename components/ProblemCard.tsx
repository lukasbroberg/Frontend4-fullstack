import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from "../config/api";
import { darken, lighten } from "../tools/colorTool";
import { Problem } from "../types/Problem";



type Props = {
  problem: Problem;
  onLikeToggle?: (ProblemId: number) => void;
  onDelete?: (ProblemId: number) => void;
};

export default function ProblemCard({ problem, onLikeToggle, onDelete }: Props) {

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

  const getTimeAgo = (DateString: string) => {
    const now = new Date();
    const created = new Date(DateString); 
    const diffMs = now.getTime() - created.getTime();

    const minutes = Math.floor(diffMs/(1000 *60));
    if (minutes < 1 ) return "Jus now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes/60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24); 
    return `${days}d ago`;
  };

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

      {problem.imageUrl ? (
        <View style={styles.problemImageContainer}>
          <Image
            source={{ uri: `${API_BASE_URL}${problem.imageUrl}` }}
            style={styles.problemImage}
            resizeMode="contain"
          />
        </View>
      ) : null}

      <Text style={styles.date}>
        {problem.username}   {getTimeAgo(problem.createdAt)}
      </Text>

       {/* Like button */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
        style={[styles.likeButton,styles.likeButtonInlineReset]}
        onPress={() => onLikeToggle?.(problem.id)}
        >
        {problem.likedByUser ? (
          <MaterialCommunityIcons name="thumb-up" size={22} color="black" />
        ) : (
        <MaterialCommunityIcons name="thumb-up-outline" size={22} color="black" />
        )}
        
        {problem.likedByUser && (
          <Text style={styles.likeCount}>{problem.likeCount}</Text>
        )}
          </TouchableOpacity>
          
          {/* Delete button - kun synlig for ejeren */}
          {problem.createdByCurrentUser && (
            <TouchableOpacity
            style={[styles.deleteButton,  styles.deleteButtonInlineReset]}
            onPress={handleDelete}
          >
            <MaterialCommunityIcons name="delete-outline" size={22} color="black" />
            <Text style={[styles.deleteText,  styles.deleteTextSpacing]}></Text>
            </TouchableOpacity>
          )}
          
      </View>
          
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
  problemImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
  },

  problemImageContainer: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 10,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
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
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 10,
  },
  likeButtonInlineReset: {
    marginTop: 0,
  },
  deleteButtonInlineReset: {
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteTextSpacing: {
    marginLeft: 4,
  },

});
