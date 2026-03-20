import { Client } from '@stomp/stompjs';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import MessageComponent from '../components/messageComponent.tsx';
import useMessageViewModel from '../services/messageViewModel.tsx';


export default function ChatScreen(){

    //blalslas kode til at skaffe url fra siden

    const params = useLocalSearchParams();
    const chatId = parseInt(params.id);

    /*  TODO: ~ After User handling and problems are fully functional
        1. Check whether the user is allowed to view the page or not (signed in?)
        2. Change author to be the name for the given user
        3. seperate code to be more flexible
        4. Remove connect button, and automatically connect when joining a page
        5. Change URI to be the endpoint Chat/{chatId} from the URI of the chatPage
    */


    const [connected, setConnected] = useState(false);
    const stompClient = useRef(null);

    //const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [nameInput, setNameInput] = useState('');

    const {messages, setMessages, fetchMessagesFromChatId} = useMessageViewModel();

    const flatListRef = useRef(null);

    useEffect(() => {
        if(flatListRef.current && messages.length>0){
            flatListRef.current.scrollToEnd({animated: true})
        }
    },[messages])

    function receiveMessage(message){

        const data = JSON.parse(message.body);

        const newMessage = Message

        setMessages(prevMessages => [...prevMessages, {
            newMessage
        }]);
    }

    //Initialize client
    function initiateConnection(){

        const client = new Client({
            brokerURL: `ws://localhost:8080/chat`,
            onConnect: () => {
                client.subscribe(`/topic/messages/${chatId}`, (message) => {
                    receiveMessage(message);
                });
                client.subscribe(`/user/queue/errors`, (error) => {
                    console.log(error.body)
                })
                fetchMessagesFromChatId(chatId);
                //client.publish({destination: `/app/chat/${chatId}`, body: JSON.stringify({author: 1, message: 'joined the chat'})});
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
            destination: `/app/chat/${chatId}`,
            body: JSON.stringify({ author: nameInput, message: messageInput })
        });
        setMessageInput('');
    };

    useEffect(() => {
    },[])


    return(
        <View>
            <Text style={chatStyle.title}>Chat {chatId}</Text>
            <FlatList
                ref={flatListRef}
                style={chatStyle.chatView}
                data={messages}
                renderItem={({item}) => (
                    <MessageComponent key={item.id} message={item.message} author={item.author}></MessageComponent>
                )}
                >
            </FlatList>
            <View style={chatStyle.messageContainer}>
                <TextInput placeholderTextColor={'gray'} style={chatStyle.messageInput} value={messageInput} placeholder="Message..." onChangeText={setMessageInput}/>
                <TextInput placeholderTextColor={'gray'} style={chatStyle.messageInput} value={nameInput} placeholder="Name..." onChangeText={setNameInput}/>
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