import Feather from '@expo/vector-icons/Feather';
import { Client } from '@stomp/stompjs';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MessageComponent from '../components/messageComponent';
import { useAuth } from '../contexts/AuthContext';
import useMessageViewModel from '../services/messageViewModel';
import { Message } from '../types/Message';


const socketURL = "ws://localhost:8080";
const baseURL = "http://localhost:8080";

export default function ChatScreen(){

    //blalslas kode til at skaffe url fra siden

    const params = useLocalSearchParams();
    const chatId: number = parseInt(params.id as string);

    console.log(chatId)

    /*  TODO: ~ After User handling and problems are fully functional
        1. Check whether the user is allowed to view the page or not (signed in?)
        2. Change author to be the name for the given user
        3. seperate code to be more flexible
        4. Remove connect button, and automatically connect when joining a page
        5. Change URI to be the endpoint Chat/{chatId} from the URI of the chatPage
    */


    const [connected, setConnected] = useState(false);
    const stompClient = useRef<Client>(null);

    //const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [nameInput, setNameInput] = useState('');

    const {messages, setMessages, fetchMessagesFromChatId} = useMessageViewModel();

    const {isAuthenticated, user, token} = useAuth();

    const flatListRef = useRef<FlatList<Message>>(null);

    useEffect(() => {
        if(flatListRef.current && messages.length>0){
            flatListRef.current.scrollToEnd({animated: true})
        }
    },[messages])

    function receiveMessage(message: {body: string}){

        const data = JSON.parse(message.body);

        const newMessage: Message = data;

        setMessages(prevMessages => [...prevMessages, newMessage]);
    }

    //Initialize client
    function initiateConnection(){

        const client = new Client({
            brokerURL: `${socketURL}/chat`,
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
        return;
    }

    if(stompClient!=null){
        stompClient.onWebSocketError = (error) => {
            console.log('error' + error);
        }
    }

    function connect(){
        if(stompClient.current == null){
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

        if(!isAuthenticated || !token){
            return alert("Unable to send messages while not signed in")
        }

        if(messageInput==''){
            return;
        }

        if (!stompClient.current || !stompClient.current.connected) {
            console.error("Not connected to WebSocket!");
            return;
        }

        console.log(user?.username)
        console.log(messageInput)

        stompClient.current.publish({
            destination: `/app/chat/${chatId}`,
            body: JSON.stringify({ author: user?.username, message: messageInput })
        });
        setMessageInput('');
    };

    useEffect(() => {
        const autoLoadAndConnect = async() => {
            await initiateConnection();
            await connect();
            await fetchMessagesFromChatId(chatId);
        }

        autoLoadAndConnect();

        //Cleanup on leaving the chat page
        return() => {
            disconnect();
        }
    },[])

    const isSendAble = connected && isAuthenticated && token && messageInput!="";


    return(
        <View>
            <Text style={chatStyle.status}>{(isAuthenticated?"":"You need to sign in to send messages")}</Text>
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
                <TextInput placeholderTextColor={'gray'} style={chatStyle.messageInput} value={messageInput} placeholder="Message..." onChangeText={setMessageInput}>
                
                </TextInput>
                <TouchableOpacity
                    style={(!isSendAble? chatStyle.messageSendBtnDisabled: chatStyle.messageSendBtn)}
                    onPress={sendMessage}
                    disabled={!isSendAble}>
                    <Feather color={(!isSendAble? 'lightgray': '#5e9cff')} name='send' size={24}></Feather>
                </TouchableOpacity>
            </View>
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
        width: 'auto',
        backgroundColor: 'white',
        flex: 1,
        margin: 5,
        shadowColor: '#00000047',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 2,
   },
    chatView: {
        padding: 20,
        borderRadius: 20,
        height: 300,
        backgroundColor: '',
        marginTop: 10,
        marginBottom: 10,
    },
    chatMessage: {
        backgroundColor: '#ededed',
        marginBottom: 10,
        borderRadius: 17,
        padding: 10,
        width: 'auto',
        height: 'auto',
        marginLeft: 'auto'
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        width: 'auto',
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 17,
        margin: 5
    },
    messageSendBtn: {
        borderRadius: 15,
        width: 'auto',
        textAlign: 'center',
        alignItems: 'center',
        padding: 10,
    },
    messageSendBtnDisabled: {
        borderRadius: 15,
        width: 'auto',
        textAlign: 'center',
        alignItems: 'center',
        padding: 10,
    },

    status: { textAlign: 'center', color: 'gray' },
})