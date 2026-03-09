import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import ProblemCard from "../components/ProblemCard";
import { getProblems } from "../services/problemService";
import { Problem } from "../types/Problem";

export default function Feed() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchProblems() {
    try {
      setError(null);
      const data = await getProblems();
      setProblems(data);
    } catch {
      setError("Kunne ikke hente problemer. Prøv igen.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchProblems();
  }, []);

  function onRefresh() {
    setRefreshing(true);
    fetchProblems();
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={problems}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ProblemCard problem={item} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4f46e5"]} />
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Ingen problemer endnu.</Text>
        </View>
      }
      contentContainerStyle={problems.length === 0 ? styles.fullHeight : styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    paddingVertical: 8,
  },
  fullHeight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 14,
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
  },
});
