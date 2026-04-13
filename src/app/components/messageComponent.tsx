import { StyleSheet, Text, View } from "react-native";
import { Message } from "../types/Message";


export default function MessageComponent({id, message, author, timeStamp}: Message){
    return(
        <View style={messageStyle.container}>
            <Text style={messageStyle.timeStamp}>{(timeStamp ? timeStamp: 'Uknown timestamp')}</Text>
            <View style={messageStyle.bubble}>
                <Text style={messageStyle.author}>{(author?author: 'unknown')}</Text>
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
        width: 'auto',
        height: 'auto',
        minHeight: 50,
        shadowColor: '#00000047',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 2,
    },
    container: {

    },
    timeStamp: {
        color: 'gray',
        fontSize: 12,
        marginBottom: 5,
    }
})