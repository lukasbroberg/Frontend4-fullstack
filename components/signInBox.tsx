import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SignInBoxProps = {
    label: string
}

export default function SignInBox({label}: SignInBoxProps){

    const router = useRouter();

    return(
        <View style={styles.container}>
                <Text style={styles.header}>
                    Sign in
                </Text>
                <Text> 
                    You need to be <TouchableOpacity onPress={() => router.navigate('/(auth)/login')}><Text style={styles.markedText}>signed in</Text></TouchableOpacity> to
                    <br></br>
                    {label}
                    <br></br>
                    or <TouchableOpacity onPress={() => router.navigate('/(auth)/register')}><Text style={styles.markedText}>create an account.</Text></TouchableOpacity>
                </Text>
        </View>
    )

}

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        marginBottom: 20
    },
    markedText: {
        fontWeight: 800,
    },
    container: {
        margin: 'auto',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 17,
        textAlign: 'center'
    }

})