import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { webSocketService } from "../WebSocketConnection/Websocket";
import { addMessage } from "features/chat/chatSlice";
import { uploadFile } from "../components/fileService";
import EmojiPicker from 'emoji-picker-react';

/**
 * ChatComponent is for rendering the chat interface and handling user input for sending messages.
 *
 * It uses Redux for state management and interacts with the WebSocketService to send and receive chat messages in real-time.
 * The component intialises the WebSocket connection on mount and disconnects on unmount.
 * Messages are displayed in a list, and users can input new messages to send to the other user.
 *
 *
 * On mount (when component is inserted to the DOM), establishes a WebSocket connection using the provided user IDs.
 * On unmount (when component is removed from the DOM), disconnects the WebSocket connection to prevent memory leaks.
 * Each new message is sent to the server via WebSocket
 * and added to the Redux store.
 *
 */

const ChatComponent = ({ userId, otherUserId }) => {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();

  // Effect hook to establish WebSocket connection on component mount and disconnect on unmount
  useEffect(() => {
    const userId = "47";
    const otherUserId = "48";
    // Connect to WebSocket server with user IDs
    webSocketService.connect(userId, otherUserId);

    return () => {
      webSocketService.disconnect(); // Disconnect WebSocket connection on component unmount to prevent memory leaks
    };
  }, [userId, otherUserId, dispatch]);

  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const sendMessage = async () => {
    let attachmentUrl = null;
    if (selectedFile) {
      attachmentUrl = await uploadFile(selectedFile);
      setSelectedFile(null); 
    }

    const messageData = {
      message: newMessage,
      sender_id: 47,
      recipient_id: 48,
      attachment: attachmentUrl, 
    };
    webSocketService.sendMessage(messageData);
    dispatch(addMessage(messageData)); 
    setNewMessage("");
  };

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.sender_id === userId ? "You" : "Them"}: {msg.message}
          </li>
        ))}
      </ul>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      />
      {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
      <input type="file" onChange={handleFileChange} style={{ display: 'none' }} ref={fileInput => this.fileInput = fileInput} />
      <button onClick={() => this.fileInput.click()}>📎</button>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
