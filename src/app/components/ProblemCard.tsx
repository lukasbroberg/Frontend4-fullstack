import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Problem } from "../types/Problem";

type Props = {
  problem: Problem;
  onLikeToggle?: (ProblemId: number) => void;
};

export default function ProblemCard({ problem, onLikeToggle }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{problem.title}</Text>
      <Text
        style={styles.description}
        numberOfLines={expanded ? undefined : 3}
      >
        {problem.description}
      </Text>
      {problem.description.length > 150 && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.seeMore}>
            {expanded ? "See less" : "See more"}
          </Text>
        </TouchableOpacity>
      )}
      <Text style={styles.date}>
        {new Date(problem.createdAt).toLocaleDateString()}
      </Text>

       {/* Like button */}
      <TouchableOpacity
        style={styles.likeButton}
        onPress={() => onLikeToggle?.(problem.id)}
        >
          <Text style={styles.heartIcon}>
            {problem.isLikedByUser ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.likeCount}>{problem.likeCount}</Text>
      </TouchableOpacity>
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
  seeMore: {
    color: "#01010a",
    fontWeight: "500", 
    marginTop: 4,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
  likeButton: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 10,
  },
  heartIcon: {
  fontSize: 20,
  marginRight: 5,
  },
  likeCount: {
    fontSize: 14,
    color: "#333",
  }
});
