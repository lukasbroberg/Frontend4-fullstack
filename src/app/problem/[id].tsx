import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet,Text, TouchableOpacity, View } from "react-native";
import {darken, lighten} from "../tools/colorTool";
import { Problem} from "../types/Problem";

export default function ProblemDetail(){
    const{data} = useLocalSearchParams();
    const router = useRouter();

    const problem: Problem = JSON.parse(data as string);

    return (
        <ScrollView style={styles.container}>

            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{problem.title}</Text>

            <View style={[styles.categoryBadge, {backgroundColor: problem.category ? lighten(problem.category.hexColor) : "lightgray"}]}>
                <Text style={{color: problem.category ? darken(problem.category.hexColor): 'gray', fontSize: 12}}>
                    {problem.category ? problem.category.name : 'No category'}
                </Text>
            </View>

            <Text style={styles.description}>{problem.description}</Text>

            <Text style={styles.date}>{new Date(problem.createdAt).toLocaleDateString()}</Text>
        
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
});
