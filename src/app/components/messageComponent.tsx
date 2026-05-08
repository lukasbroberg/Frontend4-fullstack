import { StyleSheet, Text, View } from "react-native";
import { Message } from "../types/Message";

type MessageComponentProps = Message & {
    isOwnMessage?: boolean;
    currentUsername?: string;
    createdByCurrentUser?: boolean;
    sentByCurrentUser?: boolean;
    ownMessage?: boolean;
};

export default function MessageComponent({
    id,
    message,
    author,
    timeStamp,
    isOwnMessage,
    currentUsername,
    createdByCurrentUser,
    sentByCurrentUser,
    ownMessage,
}: MessageComponentProps) {
    const safeAuthor = author || "Unknown";
    const safeTimestamp = timeStamp || "Unknown timestamp";
    const isOwn =
        isOwnMessage ||
        createdByCurrentUser ||
        sentByCurrentUser ||
        ownMessage ||
        (!!currentUsername && safeAuthor.toLowerCase() === currentUsername.toLowerCase());

    return (
        <View style={[messageStyle.container, isOwn && messageStyle.ownContainer]}>
            {!isOwn && (
                <View style={messageStyle.avatar}>
                    <Text style={messageStyle.avatarText}>{safeAuthor.charAt(0).toUpperCase()}</Text>
                </View>
            )}

            <View style={[messageStyle.content, isOwn && messageStyle.ownContent]}>
                <View style={[messageStyle.messageHeader, isOwn && messageStyle.ownMessageHeader]}>
                    <Text style={[messageStyle.author, isOwn && messageStyle.ownAuthor]}>{safeAuthor}</Text>
                    <Text style={[messageStyle.timeStamp, isOwn && messageStyle.ownTimeStamp]}>{safeTimestamp}</Text>
                </View>

                <View style={[messageStyle.bubble, isOwn && messageStyle.ownBubble]}>
                    <Text style={[messageStyle.messageText, isOwn && messageStyle.ownMessageText]}>{message}</Text>
                </View>
            </View>
        </View>
    );
}

const messageStyle = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10,
        marginBottom: 14,
        paddingHorizontal: 2,
    },
    ownContainer: {
        justifyContent: "flex-end",
    },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#dbeafe",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#bfdbfe",
    },
    avatarText: {
        color: "#2563eb",
        fontSize: 13,
        fontWeight: "800",
    },
    content: {
        flex: 1,
        maxWidth: "86%",
    },
    ownContent: {
        flex: 1,
        maxWidth: "86%",
        alignItems: "flex-end",
    },
    messageHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 5,
        paddingLeft: 2,
    },
    ownMessageHeader: {
        justifyContent: "flex-end",
        paddingLeft: 0,
        paddingRight: 2,
    },
    author: {
        color: "#0f172a",
        fontSize: 13,
        fontWeight: "800",
    },
    ownAuthor: {
        color: "#2563eb",
    },
    timeStamp: {
        color: "#94a3b8",
        fontSize: 11,
        fontWeight: "600",
    },
    ownTimeStamp: {
        color: "#64748b",
    },
    bubble: {
        alignSelf: "flex-start",
        maxWidth: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 20,
        borderBottomLeftRadius: 6,
        paddingVertical: 11,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        shadowColor: "#0f172a",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    ownBubble: {
        alignSelf: "flex-end",
        backgroundColor: "#2563eb",
        borderColor: "#2563eb",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 6,
    },
    messageText: {
        color: "#0f172a",
        fontSize: 15,
        lineHeight: 21,
        flexShrink: 1,
        flexWrap: "wrap",
    },
    ownMessageText: {
        color: "#ffffff",
    },
});