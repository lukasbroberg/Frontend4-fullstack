import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ProblemCard from "../components/ProblemCard";
import useMyProblems from "../hooks/useMyProblems";

export default function MyProblems() {

  const {loading, problems, handleDelete, handleLikeToggle} = useMyProblems();

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