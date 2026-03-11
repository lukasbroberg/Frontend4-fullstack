import { Client } from '@stomp/stompjs';
import { useEffect, useRef, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import Message from '../components/messageComponent.tsx';


export default function ChatScreen(){

    /*  TODO:
        1. Check whether the user is allowed to view the page or not (signed in?)
        2. Change author to be the name for the given user
        3. seperate code to be more flexible
    */


    const [connected, setConnected] = useState(false);
    const stompClient = useRef(null);

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    const flatListRef = useRef(null);

    useEffect(() => {
        if(flatListRef.current && messages.length>0){
            flatListRef.current.scrollToEnd({animated: true})
        }
    },[messages])

    function receiveMessage(message){

        const data = JSON.parse(message.body);

        const newMessage = {
            message: data.message,
            author: data.author
        }

        setMessages(prevMessages => [...prevMessages, {
            author: data.author,
            message: data.message
        }]);
    }

    //Initialize client
    function initiateConnection(){

        const client = new Client({
            brokerURL: 'ws://localhost:8080/chat',
            onConnect: () => {
                client.subscribe('/topic/messages', (message) => {
                    receiveMessage(message);
                });
                client.publish({destination: '/topic', body: 'Joined chat'});
                setConnected(true);
            }
        })
        stompClient.current=client;
    }

    if(stompClient!=null){
        stompClient.onWebSocketError = (error) => {
            console.log('error' + error);
        }
    }

    function connect(){
        if(!stompClient.current){
            initiateConnection();
        }
        
        stompClient.current.activate();
        console.log(stompClient.current);
        setConnected(true);
    }

    function disconnect(){
        if(!stompClient.current){
            return;
        }
        stompClient.current.deactivate();
        setConnected(false);
    }

    // Send a message
    const sendMessage = () => {
        if(messageInput==''){
            return;
        }
        if (!stompClient.current || !stompClient.current.connected) {
            console.error("Not connected to WebSocket!");
            return;
        }
        stompClient.current.publish({
            destination: "/app/chat",
            body: JSON.stringify({ author: 'Lukas', message: messageInput })
        });
        setMessageInput('');
    };

    useEffect(() => {
    },[])


    return(
        <View>
            <Text style={chatStyle.title}>Chat</Text>
            <FlatList
                ref={flatListRef}
                style={chatStyle.chatView}
                data={messages}
                renderItem={({item}) => (
                    <Message key={item.id} message={item.message} author={item.author}></Message>
                )}
                >
            </FlatList>
            <View style={chatStyle.messageContainer}>
                <TextInput placeholderTextColor={'gray'} style={chatStyle.messageInput} value={messageInput} placeholder="Message..." onChangeText={setMessageInput}/>
                <Button style={chatStyle.messageSendBtn} title="Send" onPress={sendMessage} disabled={!connected} />
            </View>
            <Button title={connected ? "Disconnect" : "Connect"} onPress={connected ? disconnect : connect} />
            <Text style={chatStyle.status}>
                {connected ? "Connected" : "Disconnected"}
            </Text>
        </View>
    )
}

const chatStyle = StyleSheet.create({
    title: {
        fontSize: 32,
    },
    messageInput: {
        padding: 10,
        borderRadius: 10,
    },
    chatView: {
        padding: 20,
        borderRadius: 20,
        height: 300,
    },
    chatMessage: {
        backgroundColor: '#ffffff',
        marginBottom: 10,
        borderRadius: 17,
        padding: 10,
        width: 200,
        height: 'auto',
        marginLeft: 'auto'
    },
    messageContainer: {
        display: 'flex',
        flex: 'column',
    },
    messageSendBtn: {
        width: 50,
    },
    status: { textAlign: 'center', color: 'gray' },
})