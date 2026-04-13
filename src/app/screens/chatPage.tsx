import Feather from '@expo/vector-icons/Feather';
import { Client } from '@stomp/stompjs';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MessageComponent from '../components/messageComponent';
import { useAuth } from '../contexts/AuthContext';
import { getChatFromProblemId } from '../services/chatService';
import useMessageViewModel from '../services/messageViewModel';
import { Message } from '../types/Message';


const socketURL = "ws://localhost:8080";
const baseURL = "http://localhost:8080";

export default function ChatScreen(){

    const params = useLocalSearchParams();
    const problemId: number = parseInt(params.id as string);
    const [chatId, setChatId] = useState<number>();
    const [connected, setConnected] = useState(false);
    const stompClient = useRef<Client>(null);
    const [messageInput, setMessageInput] = useState('');
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
    function initiateConnection(chatId: number){

        const client = new Client({
            brokerURL: `${socketURL}/chat`,
            connectHeaders:{Authorization: `Bearer ${token}`},
            onConnect: async () => {
                client.subscribe(`/topic/messages/${chatId}`, (message) => {
                    receiveMessage(message);
                });
                client.subscribe(`/user/queue/errors`, (error) => {
                    console.log(error.body)
                });

                try{
                    await fetchMessagesFromChatId(chatId);
                }catch(err){
                    //Don't do anything for now
                    console.log(err);
                }
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
    }

    function disconnect(){
        if(!stompClient.current){
            return;
        }
        stompClient.current.deactivate();
        setConnected(false);
    }

    // Send a message
    const sendMessage = async () => {

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

        const headers: Record<string, string> = {};
        headers.Authorization = `Bearer ${token}`;

        stompClient.current.publish({
            destination: `/app/chat/${chatId}`,
            body: JSON.stringify({message: messageInput }),
            headers: headers
        });
        setMessageInput('');
    };

    useEffect(() => {


        const autoLoadAndConnect = async() => {
            const _chatId: number = await getChatFromProblemId(problemId);
            await setChatId(_chatId);
            await initiateConnection(_chatId);
            await connect();
        }

        autoLoadAndConnect();

        //Cleanup connection on leaving the chat page
        return() => {
            disconnect();
        }
    },[])

    const isSendAble = connected && isAuthenticated && token && messageInput!="";
    console.log("connected: " + connected + "\n" + "token:" + token)

    return(
        <View>
            <Text style={chatStyle.status}>{(isAuthenticated?"":"You need to sign in to send messages")}</Text>
            <FlatList
                ref={flatListRef}
                style={chatStyle.chatView}
                data={messages}
                renderItem={({item}) => (
                    <MessageComponent id={null} key={item.id} message={item.message} author={item.author} timeStamp={new Date(item.timeStamp).toLocaleString()}></MessageComponent>
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