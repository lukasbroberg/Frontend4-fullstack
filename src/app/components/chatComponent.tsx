import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from '../hooks/AuthContext';
import useMessages from '../hooks/useMessages';
import { getChatFromProblemId } from '../services/chatService';
import useStompMessage from '../services/useStompMessage';
import { Message } from '../types/Message';
import MessageComponent from './messageComponent';



export default function ChatComponent(){

    const params = useLocalSearchParams();
    const problemId: number = parseInt(params.id as string);
    const [chatId, setChatId] = useState<number>();
    const [messageInput, setMessageInput] = useState('');
    const {messages, setMessages, getMessagesFromChat} = useMessages();
    const {isAuthenticated, user, token} = useAuth();
    const flatListRef = useRef<FlatList<Message>>(null);
    const {initiateConnection, activate, disconnect, publishMessageWithHeaders, connected, setConnected} = useStompMessage();


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
            try{
                //Get chatId
                const _chatId: number = await getChatFromProblemId(problemId);
                await setChatId(_chatId);
                
                //Initiate STOMP handshake
                await initiateConnection(
                    _chatId,
                    receiveMessage,
                    async () => {
                        try{
                            await getMessagesFromChat(_chatId);
                        }catch(err){
                            alert('Unable to get chats messages');
                        }
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
                    <MessageComponent
                      id={item.id}
                      message={item.message}
                      author={item.author}
                      timeStamp={new Date(item.timeStamp).toLocaleString()}
                      isOwnMessage={item.author === user?.username}
                    />
                  )}
                >
            </FlatList>
            <View style={chatStyle.messageContainer}>
                <TextInput
                    placeholderTextColor="#94a3b8"
                    style={chatStyle.messageInput}
                    value={messageInput}
                    placeholder="Message..."
                    onChangeText={setMessageInput}
                    multiline={true}
                    scrollEnabled={true}
                    textAlignVertical="top"
                    maxLength={1000}
                    blurOnSubmit={false}
                />
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
        flex: 1,
        minWidth: 0,
        minHeight: 44,
        maxHeight: 120,
        paddingHorizontal: 14,
        paddingTop: 11,
        paddingBottom: 11,
        borderRadius: 22,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        color: '#0f172a',
        fontSize: 15,
        lineHeight: 20,
        flexWrap: 'wrap',
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