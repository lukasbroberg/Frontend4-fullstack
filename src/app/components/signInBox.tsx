import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SignInBoxProps = {
    label: string
}

export default function SignInBox({label}: SignInBoxProps){

    const router = useRouter();

    return(
        <View style={styles.container}>
            <Text style={styles.header}>Sign in</Text>

            <Text style={styles.message}>You need to be signed in to</Text>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.actionsRow}>
                <TouchableOpacity onPress={() => router.navigate('/(auth)/login')}>
                    <Text style={styles.markedText}>Sign in</Text>
                </TouchableOpacity>
                <Text style={styles.message}>or</Text>
                <TouchableOpacity onPress={() => router.navigate('/(auth)/register')}>
                    <Text style={styles.markedText}>create an account</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 12,
        color: "#0f172a",
    },
    message: {
        color: "#475569",
        fontSize: 15,
        textAlign: "center",
    },
    label: {
        color: "#0f172a",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 4,
        marginBottom: 12,
    },
    markedText: {
        color: "#007AFF",
        fontWeight: "800",
        fontSize: 15,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
    },
    container: {
        alignSelf: "center",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 17,
        alignItems: "center",
        maxWidth: 320,
    }
})