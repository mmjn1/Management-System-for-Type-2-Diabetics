// features/chat/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

/**
 * 
 * This file defines the 'chat' slice of the Redux store using Redux Toolkit's createSlice method.
 * It manages the state related to chat functionalities such as messages and connection status within
 * a chat application. The slice handles actions such as adding new messages, setting old messages,
 * updating chat status, and clearing the chat history.
 *
 *
 */

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    status: "disconnected", // 'connected', 'disconnected'
  },
  reducers: {
    addMessage: (state, action) => {
      const message = action.payload;
      const messageExists = state.messages.some((msg) => msg.id === message.id);
      if (message.tempId) {
        // If the message has a tempId, check for an optimistic message to replace
        const optimisticIndex = state.messages.findIndex(
          (m) => m.tempId === message.tempId
        );
        if (optimisticIndex > -1) {
          state.messages.splice(optimisticIndex, 1, message);
        } else {
          state.messages.push(message);
        }
      } else {
        state.messages.push(message);
      }
    },
    setOldMessages: (state, action) => {
      state.messages = action.payload.concat(state.messages);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    clearChat: (state) => {
      state.messages = []; // Reset messages to an empty array
    },
  },
});

export const { addMessage, setOldMessages, setStatus, clearChat } =
  chatSlice.actions;

export default chatSlice.reducer;
