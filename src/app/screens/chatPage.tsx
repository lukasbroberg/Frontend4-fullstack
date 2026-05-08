import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MessageComponent from '../components/messageComponent';
import { useAuth } from '../hooks/AuthContext';
import useMessages from '../hooks/useMessages';
import { getChatFromProblemId } from '../services/chatService';
import useStompMessage from '../services/useStompMessage';
import { Message } from '../types/Message';



export default function ChatPage(){
    const params = useLocalSearchParams();
    console.log(params)
    const problemId: number = parseInt(params.id as string);
    const [chatId, setChatId] = useState<number>();
    const [messageInput, setMessageInput] = useState('');
    const {messages, setMessages, getMessagesFromChat} = useMessages();
    const {isAuthenticated, user, token} = useAuth();
    const flatListRef = useRef<FlatList<Message>>(null);
    const {initiateConnection, activate, disconnect, publishMessageWithHeaders, connected, setConnected} = useStompMessage();

    const newestMessagesFirst = useMemo(() => {
        return [...messages].reverse();
    }, [messages]);

    /** Automatically keep the chat at the newest message.
     * Because the FlatList is inverted, offset 0 is the bottom/newest message.
     */
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    }, [messages]);

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
                console.log(_chatId)
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
        <KeyboardAvoidingView
            style={chatStyle.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={90}
        >
            <Text style={chatStyle.status}>{(isAuthenticated?"":"You need to sign in to send messages")}</Text>
            <FlatList
                ref={flatListRef}
                style={chatStyle.chatView}
                data={newestMessagesFirst}
                keyExtractor={(item, index) =>
                    item.id != null
                        ? item.id.toString()
                        : `${item.author}-${item.timeStamp}-${index}`
                }
                nestedScrollEnabled={true}
                inverted={true}
                keyboardShouldPersistTaps="handled"
                renderItem={({item}) => (
                    <MessageComponent
                      id={item.id}
                      message={item.message}
                      author={item.author}
                      timeStamp={new Date(item.timeStamp).toLocaleString()}
                      isOwnMessage={item.author === user?.username}
                    />
                  )}
            />
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
        </KeyboardAvoidingView>
    )
}

const chatStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
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
        flex: 1,
        padding: 20,
        borderRadius: 20,
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