import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MessageComponent from '../components/messageComponent';
import { useAuth } from '../contexts/AuthContext';
import { getChatFromProblemId } from '../services/chatService';
import useMessageViewModel from '../services/messageViewModel';
import useStompMessageService from '../services/stompMessageService';
import { Message } from '../types/Message';



export default function ChatScreen(){

    const params = useLocalSearchParams();
    const problemId: number = parseInt(params.id as string);
    const [chatId, setChatId] = useState<number>();
    const [connected, setConnected] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const {messages, setMessages, fetchMessagesFromChatId} = useMessageViewModel();
    const {isAuthenticated, user, token} = useAuth();
    const flatListRef = useRef<FlatList<Message>>(null);
    const {initiateConnection, activate, disconnect, publishMessageWithHeaders} = useStompMessageService();


    /** Automatically scroll down upon new incoming messages
     */
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

    function handleSendMessage(){

        try{
            var message_req = publishMessageWithHeaders(chatId,messageInput);
            if(message_req){
                setMessageInput('');
            }
        }catch(err){
            alert(err)
        }
    }

    /** Automatically fetch messages and initialize STOMP connection on render
     */
    useEffect(() => {

        const autoLoadAndConnect = async() => {

            //Get chatId
            try{
                const _chatId: number = await getChatFromProblemId(problemId);
                await setChatId(_chatId);
                
                //Initiate STOMP handshake
                await initiateConnection(
                    _chatId,
                    receiveMessage,
                    async () => {
                        try{
                            await fetchMessagesFromChatId(_chatId);
                        }catch(err){
                            //Don't do anything for now
                            console.log(err);
                        }
                        setConnected(true);
                    }
                );
                await activate();
            }catch(error){
                console.log(error);
            }

        }

        autoLoadAndConnect();

        //Cleanup connection on leaving the chat page
        return() => {
            var disconnectResult = disconnect();
            setConnected(!disconnectResult);
        }
    },[problemId])

    const isSendAble = connected && isAuthenticated && token && messageInput!="";

    return(
        <View>
            <Text style={chatStyle.status}>{(isAuthenticated?"":"You need to sign in to send messages")}</Text>
            <FlatList
                nestedScrollEnabled={true}
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
                    onPress={handleSendMessage}
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