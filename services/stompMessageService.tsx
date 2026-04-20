import { Client } from "@stomp/stompjs";
import { useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const socketURL = "ws://localhost:8080";

export default function useStompMessageService(){

    const stompClient = useRef<Client>(null);
    const {isAuthenticated, user, token} = useAuth();

    /** Initializes handshake between the server and client
     *  onConnect: when the handshake is established
     * @param chatId The given chatId to which the webSocket should establish a connection to.
     * @param onReceivedMessages Function that evokes when receiving messages
     * @param onConnected Function that evokes when connected
     * @returns 
     */
    function initiateConnection(
        chatId: number,
        onReceivedMessages: (message: {body: string}) => void,
        onConnected: () => {})
    {
        const client = new Client({
            brokerURL: `${socketURL}/chat`,
            connectHeaders:{Authorization: `Bearer ${token}`},
            onConnect: async () => {
                client.subscribe(`/topic/messages/${chatId}`, (message) => {
                    onReceivedMessages(message);
                });
                client.subscribe(`/user/queue/errors`, (error) => {
                    console.log(error.body)
                });
                onConnected();
            }
        })
        stompClient.current=client;
        return;
    }

    /** Activates the connection
     * 
     * @returns false if unable to activate, true if activated
     */
    function activate(){
        if(stompClient.current == null){
            return false
        }
        
        stompClient.current.activate();
        return true;
    }

    /** Deactivates the connection.
     * 
     * @returns false if unable to deactive, true if deactivation was succesfull
     */
    function disconnect(){
        if(!stompClient.current){
            return false;
        }
        stompClient.current.deactivate();
        return true;
    }

    /** Sends a message to a given chatId.
     * Attaches user's token to the authorization header of the message.
     * @param chatId 
     * @param message 
     * @returns 
     */
    function publishMessageWithHeaders(
        chatId: number | undefined,
        message: string,
    ){
        if(!stompClient.current){
            throw new Error("Missing stomp client")
        }

        if(!stompClient.current.active){
            throw new Error("Current connection is not active")
        }

        if(chatId==null || chatId==undefined){
            throw new Error("Missing chat id")
        }

        if(!isAuthenticated || !token){
            throw new Error("Missing authentication from user")
        }
        
        if(message==''){
            return;
        }

        const headers: Record<string, string> = {};
        headers.Authorization = `Bearer ${token}`;

        stompClient.current.publish({
            destination: `/app/chat/${chatId}`,
            body: JSON.stringify({message: message}),
            headers: headers
        });
        return true;
    }

    function getClient(){
        return stompClient;
    }

    return {
        initiateConnection,
        activate,
        disconnect,
        publishMessageWithHeaders,
        getClient
    }
}