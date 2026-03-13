import { Tabs } from "expo-router";

export default function TabsLayout() {
    return ( // dynamic route "[ ]"
        <Tabs>
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="chatPage" options={{ title: "Chat" }} />
        </Tabs>
    )
}