import { API_BASE_URL } from "../config/api";

const socketURL = API_BASE_URL.replace("http","ws")
/*
export default function WebSocketService(){
    const ws = useRef<WebSocket>(null);
    const {isAuthenticated, user, token} = useAuth();

    async function connect(){
        const new_ws = new WebSocket(`${socketURL}/chat-native`)
        ws.current=new_ws;
    }
}

*/