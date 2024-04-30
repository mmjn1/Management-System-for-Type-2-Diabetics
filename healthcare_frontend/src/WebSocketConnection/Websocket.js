import { store } from "../store";
import { addMessage, setOldMessages, setStatus, clearChat, } from "../features/chat/chatSlice";

/**
 * This module provides the WebSocketService class, which facilitates real-time communication
 * for a chat application using WebSockets. It manages WebSocket connections to handle sending
 * and receiving messages between users. The class integrates with a Redux store to manage the chat state,
 * updating it based on the WebSocket events such as connection status changes and incoming messages.
 *
 * Key functionalities include:
 * - Establishing WebSocket connections for chat between two users.
 * - Dispatching actions to the Redux store to update the chat state upon receiving messages or when the connection status changes.
 * - Sending messages through the WebSocket.
 * - Disconnecting the WebSocket and clearing the chat state.
 */

class WebSocketService {
  constructor() {
    this.ws = null;
    this.availabilityUpdatesWs = null;
  }

  /**
   * Connects to the WebSocket server using user IDs to create a unique channel for communication.
   * Sets up event handlers for open, message, and close events to integrate with the Redux store.
   */

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

  /**
  * Sends a message through the WebSocket if the connection is open.
  */
  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Closes the WebSocket connection and clears the chat history in the Redux store.
   */
  disconnect() {
    if (this.ws) {
      store.dispatch(clearChat());
      this.ws.close();
    }
  }


}

export const webSocketService = new WebSocketService();
