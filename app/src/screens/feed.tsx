import { router } from "expo-router";
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
import { getProblems } from "../services/problemService";

type ProblemItem = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
};

export default function Feed() {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<ProblemItem[]>([]);

  useEffect(() => {
    async function loadProblems() {
      try {
        const data = await getProblems();
        console.log("Fetched problems:", data);
        setProblems(data);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProblems();
  }, []);

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
      renderItem={({ item }) => <ProblemCard problem={item} />}
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => router.push("/src/screens/UploadProblem")}
          >
            <Text style={styles.uploadButtonText}>+problem</Text>
          </TouchableOpacity>
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
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
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