import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Problem } from "../types/Problem";

type Props = {
  problem: Problem;
  onDelete?: () => void;
};

const ProblemCard: React.FC<Props> = (props: Props) => {
  const { problem, onDelete } = props;
  const date = new Date(problem.createdAt).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{problem.title}</Text>
      <Text style={styles.description}>{problem.description}</Text>
      <Text style={styles.date}>{date}</Text>
      {onDelete && (
        <View style={{ marginTop: 8 }}>
          <Button title="Slet" color="red" onPress={() => { console.log("Slet trykket"); onDelete && onDelete(); }} />
        </View>
      )}
    </View>
  );
};

export default ProblemCard;
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
});
