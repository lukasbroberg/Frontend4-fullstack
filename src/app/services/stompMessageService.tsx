import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import { useRef } from "react";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../contexts/AuthContext";

const socketURL = API_BASE_URL.replace("http","ws")

export default function useStompMessageService(){

    const rxStompRef = useRef(new RxStomp());
    const rxStomp = rxStompRef.current;
    const {isAuthenticated, user, token} = useAuth();

    const rxStompConfig: RxStompConfig = {
        brokerURL: `${socketURL}/chat`,
        connectHeaders: {Authorization: `Bearer ${token}`},
        //debug: (str) => console.log("Stomp debug", str),
        forceBinaryWSFrames: true, //IMportant for Iphone and android web sockets!!!
        heartbeatIncoming: 0,
        heartbeatOutgoing: 10000,
        reconnectDelay: 2000,
    }

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
        rxStomp.configure(rxStompConfig)

        rxStomp.connected$.subscribe(() => {
            rxStomp.watch(`/topic/messages/${chatId}`).subscribe((message) => {
                onReceivedMessages(message);
            });
            rxStomp.watch(`/user/queue/errors`).subscribe((error) => {
                console.log(error.body);
            });
            onConnected();
        })
    }



    /** Activates the connection
     * 
     * @returns false if unable to activate, true if activated
     */
    function activate(){
        if(rxStomp == null){
            return false
        }
        
        rxStomp.activate();
        return true;
    }

    /** Deactivates the connection.
     * 
     * @returns false if unable to deactive, true if deactivation was succesfull
     */
    function disconnect(){
        if(!rxStomp){
            return false;
        }
        rxStomp.deactivate();
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
        if(!rxStomp){
            throw new Error("Missing stomp client")
        }

        if(!rxStomp.active){
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

        rxStomp.publish({
            destination: `/app/chat/${chatId}`,
            body: JSON.stringify({message: message}),
            headers: headers
        });
        return true;
    }

    function getClient(){
        return rxStomp;
    }

    return {
        initiateConnection,
        activate,
        disconnect,
        publishMessageWithHeaders,
        getClient
    }
}