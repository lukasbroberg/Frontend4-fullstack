import { StyleSheet, Text, View } from "react-native";
import { Message } from "../types/Message";


export default function MessageComponent({message, author}: Message){
    return(
        <View style={messageStyle.container}>
            <Text style={messageStyle.author}>{(author?author: 'unknown')}</Text>
            <View style={messageStyle.bubble}>
                <Text>{message}</Text>
            </View>
        </View>
    )
}

const messageStyle = StyleSheet.create({
    author: {
        color: 'gray',
        marginBottom: 5,
    },
    bubble: {
        backgroundColor: '#ffffff',
        marginBottom: 10,
        borderRadius: 17,
        padding: 10,
        width: 200,
        height: 'auto',
        marginLeft: 'auto'
    },
    container: {

    }
})