import { Feather } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../hooks/AuthContext";

const colors = {
    background: "#f8fafc",
    card: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    muted: "#64748b",
    primary: "#2563eb",
};

export default function TabsLayout() {
    const { isAuthenticated, logout } = useAuth();

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
                    onPress={() => router.replace("/(auth)/login")}
                    style={({ pressed }) => [styles.ghostButton, pressed && styles.buttonPressed]}
                >
                    <Text style={styles.ghostButtonText}>Login</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.replace("/(auth)/register")}
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
                >
                    <Text style={styles.primaryButtonText}>Register</Text>
                </Pressable>
            </View>
        );
    };

    return (
        <Tabs
            initialRouteName="feed"
            screenOptions={{
                headerShown: true,
                headerRight: loginButtonHeader,
                headerTitleAlign: "center",
                headerStyle: styles.header,
                headerTitleStyle: styles.headerTitle,
                headerShadowVisible: false,
                sceneStyle: styles.scene,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.muted,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            <Tabs.Screen
                name="feed"
                options={{
                    title: "ProblemHub",
                    tabBarLabel: "Feed",
                    tabBarIcon: ({ color, focused }) => (
                        <Feather name="home" color={color} size={focused ? 22 : 20} />
                    ),
                }}
            />
            <Tabs.Screen
                name="UploadProblem"
                options={{
                    title: "Create problem",
                    tabBarLabel: "Create",
                    tabBarIcon: ({ color, focused }) => (
                        <Feather name="plus-circle" color={color} size={focused ? 22 : 20} />
                    ),
                }}
            />
            <Tabs.Screen
                name="MyProblems"
                options={{
                    title: "My problems",
                    tabBarLabel: "Mine",
                    tabBarIcon: ({ color, focused }) => (
                        <Feather name="user" color={color} size={focused ? 22 : 20} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    scene: {
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: "800",
    },
    tabBar: {
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        height: 84,
        paddingTop: 8,
        paddingBottom: 24,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: "700",
    },
    buttonGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginRight: 12,
    },
    ghostButton: {
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: colors.card,
    },
    ghostButtonText: {
        color: colors.text,
        fontSize: 13,
        fontWeight: "700",
    },
    primaryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        marginRight: 12,
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
