import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ProblemCard from "../components/ProblemCard";
import { useAuth } from "../contexts/AuthContext";
import {
  deleteProblem,
  getMyProblems,
  likeProblem,
  unlikeProblem,
} from "../services/problemService";
import { Problem } from "../types/Problem";

export default function MyProblems() {
  const { isAuthenticated, user } = useAuth();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProblems() {
      try {
        setLoading(true);
        const data = await getMyProblems();

        const normalizedProblems = data.map((problem: Problem) => ({
          ...problem,
          username:
            problem.username ??
            (problem.createdByCurrentUser ? user?.username ?? null : null),
          createdByCurrentUser: true,
        }));

        setProblems(normalizedProblems);
      } catch (error) {
        console.error("ERROR LOADING MY PROBLEMS:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadProblems();
    } else {
      setProblems([]);
      setLoading(false);
    }
  }, [isAuthenticated, user?.username]);

  const handleLikeToggle = async (problemId: number) => {
    const userId = user?.id;
    if (userId == null) return;

    const problem = problems.find((p) => p.id === problemId);
    if (!problem) return;

    try {
      if (problem.likedByUser) {
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
                likeCount: p.likedByUser ? p.likeCount - 1 : p.likeCount + 1,
              }
            : p
        )
      );
    } catch (error) {
      console.error("Fejl ved like/unlike:", error);
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
        <ProblemCard
          problem={item}
          onLikeToggle={handleLikeToggle}
          onDelete={handleDelete}
        />
      )}
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Mine problemer</Text>
          <Text style={styles.subtitle}>Problemer du selv har oprettet</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.centeredContent}>
          <Text style={styles.emptyText}>Du har ikke oprettet nogen problemer endnu.</Text>
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
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  headerContainer: {
    marginBottom: 14,
  },
  title: {
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
});