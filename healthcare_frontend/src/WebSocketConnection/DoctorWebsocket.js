class DoctorWebSocket {
    constructor(doctorId, onAppointmentUpdate) {
      this.doctorId = doctorId;
      this.onAppointmentUpdate = onAppointmentUpdate;
      this.socket = null;
    }
  
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
  
    getWebSocketUrl(doctorId) {
      return `ws://localhost:8000/ws/availability-updates/${doctorId}/`;
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
    }
  
    // Add any additional methods you may need for sending messages, etc.
  }
  
  export default DoctorWebSocket;