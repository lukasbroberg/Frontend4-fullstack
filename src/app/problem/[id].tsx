import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ChatScreen from "../screens/chatPage";
import { darken, lighten } from "../tools/colorTool";
import { Problem } from "../types/Problem";

export default function ProblemDetail(){
    const{data} = useLocalSearchParams();

    const problem: Problem = JSON.parse(data as string);
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: problem.title}} />
            <View style={[styles.categoryBadge, {backgroundColor: problem.category ? lighten(problem.category.hexColor) : "lightgray"}]}>
                <Text style={{color: problem.category ? darken(problem.category.hexColor): 'gray', fontSize: 12}}>
                    {problem.category ? problem.category.name : 'No category'}
                </Text>
            </View>

            <Text style={styles.description}>{problem.description}</Text>

            {problem.imageUrl ? (
                <View style={styles.problemImageContainer}>
                    <Image
                        source={{ uri: `http://localhost:8080${problem.imageUrl}` }}
                        style={styles.problemImage}
                        resizeMode="contain"
                    />
                </View>
            ) : null}

            <Text style={styles.date}>{new Date(problem.createdAt).toLocaleDateString()}</Text>


            {problem.createdByCurrentUser && (
                <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push({pathname: '/problem/edit/[id]', params: { id: problem.id, data: JSON.stringify(problem)}} as any)}
                >
                    <Feather name="edit" size={20} color="#333" />
                    <Text style={styles.editText}>Redigere</Text>
                </TouchableOpacity>
            )}

            <View>
              <Text style={styles.label}>Beskeder</Text>
              <ChatScreen>
              </ChatScreen>
            </View>
        
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
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

  problemImageContainer: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  problemImage: {
    width: '100%',
    height: '100%',
  },


  date: {
    fontSize: 12,
    color: 'gray',
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap:6,
  },

  editText: {
    fontSize: 16,
    color: '#333',
  },
  label: {
    marginTop: 20
  }
});
