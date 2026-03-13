import { StyleSheet, Text, View } from "react-native";
import { Problem } from "../types/Problem";

type Props = {
  problem: Problem;
};

export default function ProblemCard({ problem }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{problem.title}</Text>
      <Text style={styles.description}>{problem.description}</Text>
      <Text style={styles.date}>
        {new Date(problem.createdAt).toLocaleString()}
      </Text>
    </View>
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
  date: {
    fontSize: 12,
    color: "gray",
  },
});