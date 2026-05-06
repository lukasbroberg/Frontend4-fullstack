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

/** Card component displaying a problem with like and delete actions. */
export default function ProblemCard({ problem, onLikeToggle, onDelete }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  /** Shows a delete confirmation dialog, using native Alert on mobile and a modal on web. */
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

  /**
   * Returns a human-readable time string relative to now.
   * @param DateString - ISO date string of the creation time.
   * @returns Formatted string e.g. "5m ago", "2h ago", "3d ago".
   */
  const getTimeAgo = (DateString: string) => {
    const now = new Date();
    const created = new Date(DateString);
    const diffMs = now.getTime() - created.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const categoryBackgroundColor = problem.category ? lighten(problem.category.hexColor) : "#f1f5f9";
  const categoryTextColor = problem.category ? darken(problem.category.hexColor) : "#64748b";

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/problem/[id]",
          params: { id: problem.id, data: JSON.stringify(problem) },
        } as any)
      }
    >
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
                onPress={() => {
                  setShowConfirm(false);
                  onDelete?.(problem.id);
                }}
              >
                <Text style={styles.confirmText}>Slet</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.cardHeader}>
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {problem.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText} numberOfLines={1}>
              {problem.username || "Unknown user"}
            </Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{getTimeAgo(problem.createdAt)}</Text>
          </View>
        </View>

        <View style={[styles.categoryPill, { backgroundColor: categoryBackgroundColor }]}>
          <Text style={[styles.categoryText, { color: categoryTextColor }]} numberOfLines={1}>
            {problem.category ? problem.category.name : "No category"}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {problem.description}
      </Text>

      {problem.imageUrl ? (
        <View style={styles.problemImageContainer}>
          <Image
            source={{ uri: `${API_BASE_URL}${problem.imageUrl}` }}
            style={styles.problemImage}
            resizeMode="cover"
          />
        </View>
      ) : null}

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.actionButton, problem.likedByUser && styles.actionButtonActive]}
          onPress={(event) => {
            event.stopPropagation();
            onLikeToggle?.(problem.id);
          }}
        >
          <MaterialCommunityIcons
            name={problem.likedByUser ? "thumb-up" : "thumb-up-outline"}
            size={18}
            color={problem.likedByUser ? "#2563eb" : "#475569"}
          />
          <Text style={[styles.actionText, problem.likedByUser && styles.actionTextActive]}>
            {problem.likeCount}
          </Text>
        </TouchableOpacity>

        {problem.createdByCurrentUser && (
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.deleteButton}
            onPress={(event) => {
              event.stopPropagation();
              handleDelete();
            }}
          >
            <MaterialCommunityIcons name="delete-outline" size={18} color="#ef4444" />
            <Text style={styles.deleteText}>Slet</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 23,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  metaText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
  },
  categoryPill: {
    maxWidth: 130,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "800",
  },
  description: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  problemImageContainer: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  problemImage: {
    width: "100%",
    height: "100%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  actionButtonActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  actionText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "800",
  },
  actionTextActive: {
    color: "#2563eb",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  deleteText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "800",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialog: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  dialogTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  dialogMessage: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 20,
  },
  dialogButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
  },
  cancelText: {
    color: "#334155",
    fontWeight: "800",
  },
  confirmBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#ef4444",
  },
  confirmText: {
    color: "#ffffff",
    fontWeight: "800",
  },
});
