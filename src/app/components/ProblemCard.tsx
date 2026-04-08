import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { darken, lighten } from "../tools/colorTool";
import { Problem } from "../types/Problem";

type Props = {
  problem: Problem;
  onLikeToggle?: (ProblemId: number) => void;
  onDelete?: (ProblemId: number) => void;
};

export default function ProblemCard({ problem, onLikeToggle, onDelete }: Props) {
  const router =useRouter();

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push({pathname: '/problem/[id]', params: {id: problem.id, data: JSON.stringify(problem) } } as any)}>
    
        <Text style={styles.title}>{problem.title}
          <Text 
          style={
            [styles.category, 
              {
                backgroundColor: (problem.category?lighten(problem.category.hexColor):'lightgray'),
                color: (problem.category?darken(problem.category.hexColor):'gray')
              }
            ]
          }>{(problem.category?problem.category.name: 'No category')}</Text>
          </Text>
      <Text
        style={styles.description}
        numberOfLines={2}
      >
        {problem.description}
      </Text>

      <Text style={styles.date}>
        {new Date(problem.createdAt).toLocaleDateString()}
      </Text>

       {/* Like button */}
      <TouchableOpacity
        style={styles.likeButton}
        onPress={() => onLikeToggle?.(problem.id)}
        >
          <Text style={styles.heartIcon}>
            {problem.likedByUser ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.likeCount}>{problem.likeCount}</Text>
      </TouchableOpacity>
      {/* Delete button - kun synlig for ejeren */}
      {problem.createdByCurrentUser && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete?.(problem.id)}
        >
          <Text style={styles.deleteText}>🗑️ Slet</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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
  },
  deleteButton: {
    marginTop: 8,
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
  },
  category: {
    color: 'black',
    marginLeft: 20,
    fontSize: 12,
    textAlign: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 20,
    fontWeight: 'normal',
  }

});
