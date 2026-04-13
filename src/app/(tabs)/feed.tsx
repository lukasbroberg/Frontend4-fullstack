import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProblemCard from "../components/ProblemCard";
import {
  deleteProblem,
  getProblems,
  likeProblem,
  ProblemSort,
  unlikeProblem,
} from "../services/problemService";
import { Problem } from "../types/Problem";

const SORT_OPTIONS: { label: string; value: ProblemSort }[] = [
  { label: "Flest likes", value: "likesdesc" },
  { label: "Færrest likes", value: "likesasc" },
  { label: "Nyeste", value: "datedesc" },
  { label: "Ældste", value: "dateasc" },
];

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedSort, setSelectedSort] = useState<ProblemSort | undefined>(undefined);

  useEffect(() => {
    async function loadProblems() {
      try {
        setLoading(true);
        const data = await getProblems(selectedSort);
        console.log("Fetched problems:", data);
        setProblems(data);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProblems();
  }, [selectedSort]);

  const handleSortPress = (sortValue: ProblemSort) => {
    setSelectedSort((prev) => (prev === sortValue ? undefined : sortValue));
  };

  const handleLikeToggle = async (problemId: number) => {
    const problem =problems.find((p) => p.id === problemId);
    if (!problem) return;

    try {
      if(problem.likedByUser){
        await unlikeProblem(problemId);
      } else {
        await likeProblem(problemId);
      }

      setProblems((prev) => 
        prev.map((p) => 
          p.id === problemId
            ? {
                ...p,
                likedByUser: !p.likedByUser,
                likeCount: p.likedByUser ? p.likeCount -1 : p.likeCount +1,
              }
            : p   
        )
      )
    } catch (error) {
      console.error('Fejl ved like/unlike:', error)
      }
  };

  const handleDelete = async (problemId: number) => {
  try {
    await deleteProblem(problemId);
    setProblems((prev) => prev.filter((p) => p.id !== problemId));
  } catch (error) {
    console.error("Fejl ved sletning:", error);
  }
};

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={problems}
      keyExtractor={(item) => item.id.toString()}

      renderItem={({ item }) => (
      <ProblemCard problem={item} onLikeToggle={handleLikeToggle} onDelete={handleDelete} />
      )}
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <View style={styles.sortContainer}>
            {SORT_OPTIONS.map((option) => {
              const isSelected = selectedSort === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.sortButton, isSelected && styles.sortButtonSelected]}
                  onPress={() => handleSortPress(option.value)}
                >
                  <Text
                    style={[styles.sortButtonText, isSelected && styles.sortButtonTextSelected]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </View>
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Ingen problemer endnu.</Text>
        </View>
      }
      contentContainerStyle={
        problems.length === 0 ? styles.fullHeight : styles.listContent
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  listContent: {
    padding: 16,
  },
  fullHeight: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    padding: 16,
    gap: 12,
  },
  sortContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sortButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  sortButtonSelected: {
    backgroundColor: "#4f46e5",
  },
  sortButtonText: {
    color: "#1f2937",
    fontSize: 13,
    fontWeight: "600",
  },
  sortButtonTextSelected: {
    color: "#ffffff",
  },
  uploadButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "center",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
});