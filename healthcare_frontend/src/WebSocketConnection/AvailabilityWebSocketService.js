// AvailabilityWebSocketService.js

class AvailabilityWebSocketService {
    constructor() {
        this.availabilityUpdatesWs = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connectToDoctorAvailabilityUpdates(doctorId, messageCallback) {
        const protocolPrefix = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const availabilityUpdatesUrl = `${protocolPrefix}//localhost:8000/ws/availability-updates/${doctorId}/`;
        this.availabilityUpdatesWs = new WebSocket(availabilityUpdatesUrl);

        this.availabilityUpdatesWs.onopen = () => {
            console.log('Connected to doctor availability updates WebSocket');
            this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        };

        this.availabilityUpdatesWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (messageCallback) { // Use the provided callback function
                messageCallback(data);
            }
        };

        this.availabilityUpdatesWs.onclose = (e) => {
            console.log('Doctor availability updates WebSocket closed', e);
            this.attemptReconnect(doctorId, messageCallback);
        };

        this.availabilityUpdatesWs.onerror = (error) => {
            console.error('WebSocket error in availability updates:', error);
            this.availabilityUpdatesWs.close(); // Ensure the connection is closed after an error
        };
    }

    attemptReconnect(doctorId, messageCallback) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
                console.log(`Attempting to reconnect... (Attempt ${this.reconnectAttempts + 1})`);
                this.reconnectAttempts++;
                this.connectToDoctorAvailabilityUpdates(doctorId, messageCallback);
            }, 2000 * this.reconnectAttempts); // Exponential back-off
        } else {
            console.log('Max reconnect attempts reached. Giving up.');
            
        }
    }

    disconnectFromDoctorAvailabilityUpdates() {
        if (this.availabilityUpdatesWs) {
            this.reconnectAttempts = 0; // Reset reconnect attempts
            this.availabilityUpdatesWs.close();
        }
    }

    sendMessage(message) {
        if (this.availabilityUpdatesWs && this.availabilityUpdatesWs.readyState === WebSocket.OPEN) {
            this.availabilityUpdatesWs.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected.');
        }
    }
}

export const availabilityWebSocketService = new AvailabilityWebSocketService();
