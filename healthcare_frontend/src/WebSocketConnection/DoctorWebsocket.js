/**
 * This module defines the DoctorWebSocket class, which manages WebSocket connections for doctors
 * to receive real-time updates about their appointments. The class provides methods to connect to the WebSocket server,
 * handle incoming messages, and close the connection. It uses the doctor's ID to construct a unique WebSocket URL
 * for receiving updates specific to their schedule and availability.
 *
 * Key functionalities include:
 * - Establishing a WebSocket connection.
 * - Handling open, message, close, and error events of the WebSocket.
 * - Parsing incoming messages and triggering UI updates through a callback.
 * - Disconnecting the WebSocket connection when needed.
 */


class DoctorWebSocket {
  /**
   * This class manages the WebSocket connection for a doctor to receive real-time updates about appointments.
   * It handles the establishment of the connection, the reception of messages, and the closure of the connection.
   * Upon receiving a notification through the WebSocket, it triggers a callback function to update the appointment data in the UI.
   */
  constructor(doctorId, onAppointmentUpdate) {
    this.doctorId = doctorId;
    this.onAppointmentUpdate = onAppointmentUpdate;
    this.socket = null;
  }

  /**
 * Establishes a WebSocket connection using the doctor's ID to construct the URL.
 * It sets up event listeners to handle the opening of the connection, incoming messages,
 * errors, and the closing of the connection.
 */

  connect() {
    const wsUrl = this.getWebSocketUrl(this.doctorId);
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      console.log('WebSocket message right here :', event.data); // Log the raw data received
      const data = JSON.parse(event.data);
      if (data.notification) {
        console.log('Parsed notification:', data.notification); // Log the parsed notification
        this.onAppointmentUpdate(data.notification);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error', error);
    };
  }

  /**
 * Constructs the WebSocket URL using the doctor's ID.
 * This URL is specific to the doctor's availability updates.
 */

  getWebSocketUrl(doctorId) {
    return `ws://localhost:8000/ws/availability-updates/${doctorId}/`;
  }

  /**
   * Closes the WebSocket connection if it is currently open.
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

}

export default DoctorWebSocket;
