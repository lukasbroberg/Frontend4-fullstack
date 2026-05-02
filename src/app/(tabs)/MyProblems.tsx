import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
} from "react-native";

import { useAuth } from "../contexts/AuthContext";
import { getMyProblems } from "../services/problemService";

export default function MyProblems() {
  const { isAuthenticated } = useAuth();

  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        setLoading(true);

        const data = await getMyProblems();

        console.log("PROBLEMS DATA:", data);

        setProblems(data);
      } catch (error) {
        console.log("ERROR LOADING PROBLEMS:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadProblems();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My problems</Text>

      <FlatList
        data={problems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.problemTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No problems found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
});