/*import { Client } from "@stomp/stompjs";

import { WebSocket } from "ws";

async function connectToWebSocket(){
    const client = new Client({
        brokerURL: 'ws://192.168.1.216:8080/ws',
        onConnect: () => {
            client.subscribe('/topic', message => {
                console.log(message.body)
            });
            client.publish({destination: '/topic', body: 'First message'});
        }
    })
    return client;
}

async function sendMessage(){
    
}

client.activate()*/