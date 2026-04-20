import { Text, View, FlatList, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getMyProblems } from "../../services/problemService";import { getProblems } from "../../services/problemService";

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

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Please login first</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        My problems
      </Text>

      <FlatList
        data={problems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {item.title}
            </Text>
            <Text style={{ marginTop: 4 }}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No problems found</Text>}
      />
    </View>
  );
}