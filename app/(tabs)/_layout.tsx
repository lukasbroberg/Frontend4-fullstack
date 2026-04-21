import { Feather } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function TabsLayout() {
    const { isAuthenticated, isLoading, logout } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login" as any);
        }
    }, [isAuthenticated, isLoading]);

    const loginButtonHeader = () => {
        if (isAuthenticated) {
            return (
                <Pressable
                    onPress={logout}
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
                >
                    <Text style={styles.primaryButtonText}>Logout</Text>
                </Pressable>
            );
        }

        return (
            <View style={styles.buttonGroup}>
                <Pressable
                    onPress={() => router.replace("/login" as any)}
                    style={({ pressed }) => [styles.ghostButton, pressed && styles.buttonPressed]}
                >
                    <Text style={styles.ghostButtonText}>Login</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.replace("/register" as any)}
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
                >
                    <Text style={styles.primaryButtonText}>Register</Text>
                </Pressable>
            </View>
        );
    };

    if (isLoading) return null;
    if (!isAuthenticated) return null;

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerRight: loginButtonHeader,
            }}
        >
            <Tabs.Screen
                name="feed"
                options={{
                    title: "ProblemHub",
                    tabBarIcon: ({ color }) => (
                        <Feather name="home" color={color} size={16} />
                    ),
                }}
            />
            <Tabs.Screen
                name="UploadProblem"
                options={{
                    title: "Create new",
                    tabBarIcon: ({ color }) => (
                        <Feather name="plus-circle" color={color} size={16} />
                    ),
                }}
            />
            <Tabs.Screen
                name="MyProblems"
                options={{
                    title: "My problems",
                    tabBarIcon: ({ color }) => (
                        <Feather name="user" color={color} size={16} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    buttonGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginRight: 6,
    },
    ghostButton: {
        borderWidth: 1,
        borderColor: "#0f172a",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: "#ffffff",
    },
    ghostButtonText: {
        color: "#0f172a",
        fontSize: 13,
        fontWeight: "700",
    },
    primaryButton: {
        backgroundColor: "#0f172a",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
    },
    primaryButtonText: {
        color: "#ffffff",
        fontSize: 13,
        fontWeight: "700",
    },
    buttonPressed: {
        opacity: 0.78,
        transform: [{ scale: 0.98 }],
    },
});

