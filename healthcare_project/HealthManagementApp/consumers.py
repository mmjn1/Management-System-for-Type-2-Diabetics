from channels.generic.websocket import AsyncWebsocketConsumer
import json

class DoctorAvailabilityConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.doctor_id = self.scope['url_route']['kwargs']['doctor_id']
        self.room_group_name = f'doctor_{self.doctor_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def doctor_availability_update(self, event):
        # This method handles sending availability updates
        await self.send_json({
            'type': 'availability_update',
            'message': event['message']
        })

    async def send_appointment_notification(self, event):
        # This method handles sending appointment notifications
        await self.send_json({
            'type': 'appointment_notification',
            'notification': event['notification']
        })

    async def send_json(self, data):
        # Helper method to send JSON data
        await self.send(text_data=json.dumps(data))

    async def receive_json(self, content):
    # This method is called when a message is received with JSON content
        message_type = content.get('type')

        if message_type == 'appointment_deleted':
        # Broadcast the deletion to the doctor's channel
            await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'appointment.deleted',  
                'appointment_id': content['appointment_id']
            }
        )

    async def appointment_deleted(self, event):
    # Send a message down to the client
        await self.send_json({
        'type': 'appointment_deleted',
        'appointment_id': event['appointment_id']
    })

