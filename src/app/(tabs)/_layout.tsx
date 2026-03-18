import { Tabs } from "expo-router";

export default function TabsLayout() {
    return ( // dynamic route "[ ]"
        <Tabs>
            <Tabs.Screen name="feed" options={{ title: "ProblemHub" }} />
            <Tabs.Screen name="chatPage" options={{ title: "Chat" }} />
        </Tabs>
    )
}