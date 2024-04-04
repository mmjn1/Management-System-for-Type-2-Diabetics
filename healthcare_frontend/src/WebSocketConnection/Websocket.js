import { store } from "../store";
import {
  addMessage,
  setOldMessages,
  setStatus,
  clearChat,
} from "../features/chat/chatSlice";

class WebSocketService {
  constructor() {
    this.ws = null;
    this.availabilityUpdatesWs = null;
  }

  connect(userId, otherUserId) {
    this.ws = new WebSocket(`ws://localhost:8000/ws/chat/${userId}/${otherUserId}/`);

    this.ws.onopen = () => {
      store.dispatch(setStatus("connected"));
    };

    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "old_messages") {
        store.dispatch(setOldMessages(data.messages));
      } else {
        store.dispatch(addMessage(data));
      }
    };

    this.ws.onclose = () => {
      store.dispatch(setStatus("disconnected"));
    };
  }
  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.ws) {
      store.dispatch(clearChat());
      this.ws.close();
    }
  }

 
}

export const webSocketService = new WebSocketService();
