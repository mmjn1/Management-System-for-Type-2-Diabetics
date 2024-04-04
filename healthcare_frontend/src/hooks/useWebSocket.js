// src/hooks/useWebSocket.js
import { useState, useEffect } from "react";

/**
 * This custom hook is for managing WebSocket connections.
 * 
 * This hook provides functionalities to connect to a WebSocket server, manage the incoming and outgoing messages,
 * and properly handle the connection's lifecycle. 
 * 
 * It abstracts the complexities associated with WebSockets, 
 * making it easier to integrate real-time messaging features into React components.
 *
* 
 * Features:
 * - Establishes a WebSocket connection upon component mount or URL change.
 * - Listens for incoming messages and updates the `messages` state accordingly.
 * - Provides a `sendMessage` method to allow sending messages through the WebSocket.
 * - Automatically closes the WebSocket connection when the component unmounts or the URL changes.
 *
 * Note:
 * - The hook logs the connection status to the console for debugging purposes.
 * - Ensure the server at the specified URL supports WebSocket connections.
 */


export default function useWebSocket(url) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log(url, "i am url");
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket Connected111111111111111111111111111111111111111");
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage };
}
