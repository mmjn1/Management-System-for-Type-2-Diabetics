import os
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from .models import Message
from django.db.models import Q
from django.utils import timezone
from django.db.models import CharField, Value
from django.db.models.functions import Concat, Cast
import base64  
from django.core.files.base import ContentFile
import mimetypes  
from django.conf import settings
from .EmailSys import EmailThreading




"""
The consumers.py (similar to Django views ) contains the consumer classes for handling asynchronous communication
between the server and the client in a Django Channels application.

It leverages Django Channels to facilitate real-time communication between patients and doctors in a chat application.

The ChatConsumer class is an asynchronous WebSocket consumer that handles chat messages and notifications.
- It establishes a WebSocket connection between a client and the server.
- Receives messages from the client through the WebSocket.
- Processes messages and saves them to the database.
- Sends messages to the client.

"""

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Handles the WebSocket connection event. This method is called when a client
        attempts to establish a WebSocket connection. It sets up the necessary parameters,
        adds the connection to a group for group messaging, and sends back previously
        stored messages to the client.
        """
        # Extract user IDs from the URL route parameters and store them as instance variables
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.other_user_id = self.scope['url_route']['kwargs']['other_user_id']
        
        # Define a common group name for the chat room
        self.room_group_name = 'chat_room'
        
        # Add this WebSocket connection to a group to enable message broadcasting to all users in the group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        
        # Accept the WebSocket connection
        await self.accept()
        # Retrieve old messages that are relevant to the users in this chat session
        old_messages = await self.get_filtered_messages()
        await self.send(text_data=json.dumps({'type': 'old_messages', 'messages': old_messages}))

    async def disconnect(self, close_code):
        """
        Handles the WebSocket disconnection event. This method is called when a client
        disconnects from the WebSocket. It removes the connection from the group to
        stop further message broadcasting to this client.
        """
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        """
        Asynchronously handles receiving messages from the WebSocket. This method processes both text and binary data,
        extracts message content, handles file attachments encoded in base64, and broadcasts the message to the group.

        Args:
            text_data (str, optional): JSON string containing the message and other metadata.
            bytes_data (bytes, optional): Binary data (not used in this implementation).

        Processes:
        - Creates a directory for temporary uploads if it doesn't exist.
        - Decodes the JSON data from the text_data argument.
        - Attempts to extract and decode any attached files from the base64 encoded string.
        - Saves the message and the attachment (if any) to the database.
        - Broadcasts the message to all users in the chat group.
        """
        data = None
        directory = 'temp_uploads'
        os.makedirs(directory, exist_ok=True)
        text_data_json = json.loads(text_data)
        dict = {}
        try:
            file_64 = (text_data_json['attachment'])
            dict = {
                'filename': file_64
            }
            tempId = text_data_json['tempId']
            format, imgstr = file_64.split(';base64,')
            ext = format.split('/')[-1]
            data = ContentFile(base64.b64decode(imgstr), name=str(tempId) + '.' + ext)
        except Exception as e:
            print("No 'attachment' found in the data", e)

        message = text_data_json['message'].strip()
        recipient_id = text_data_json['recipient_id']
        sender_id = text_data_json['sender_id']
        await self.save_message(message, recipient_id, sender_id, data)
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'chat_message',
            'message': message,
            "recipient_id": recipient_id,
            "sender_id": sender_id,
            "attachment": json.dumps(dict)
        })

    @database_sync_to_async
    def get_filtered_messages(self):
        """
        Retrieves messages from the database that are filtered based on the current user and the other user involved in the chat.
        This method ensures that only relevant messages are fetched, enhancing privacy and relevance. It also formats the messages
        to include additional details such as sender and recipient full names, and formatted timestamps. If attachments are present,
        they are encoded into a base64 format for transmission over the WebSocket.
        """
        queryset = (
            Message.objects.filter(
                Q(sender_id=self.user_id, recipient_id=self.other_user_id) |
                Q(sender_id=self.other_user_id, recipient_id=self.user_id)
            ).annotate(
                sender_full_name=Concat('sender__first_name', Value(' '), 'sender__last_name',
                                        output_field=CharField()),
                recipient_full_name=Concat('recipient__first_name', Value(' '), 'recipient__last_name',
                                           output_field=CharField()),
                formatted_timestamp=Cast('timestamp', output_field=CharField())
            ).values('sender_id', 'recipient_id', 'message', 'formatted_timestamp',
                     'sender_full_name', 'recipient_full_name', 'attachment').order_by('timestamp')
        )
        for message in queryset:
            if message['attachment']:
                full_attachment_path = os.path.join(settings.MEDIA_ROOT, message['attachment'])
                mime_type = mimetypes.guess_type(full_attachment_path)[0] or 'application/octet-stream'

                with open(full_attachment_path, 'rb') as attachment_file:
                    encoded_data = base64.b64encode(attachment_file.read())
                    data_uri = 'data:' + mime_type + ';base64,' + encoded_data.decode('utf-8')
                    message['attachment'] = data_uri
            else:
                message['attachment'] = ''

        return list(queryset)

    @sync_to_async
    def get_user(self, user_id):
        """
        Retrieves a user object from the database using the provided user ID. This method is essential for fetching
        user details that are necessary for sending personalized messages and managing user-specific data within the chat.
        """
    
        return User.objects.get(id=user_id)

    async def chat_message(self, event):
        """
        Handles sending chat messages to the client. This method is called internally
        when a message needs to be sent to the client. It formats the message data,
        including attachments, and sends it through the WebSocket.
        """
        message = event['message']
        recipient_id = event['recipient_id']
        sender_id = event['sender_id']
        attachment = event['attachment']
        text = json.loads(attachment)
        file_name = None

        try:
            file_name = text['filename']
        except Exception as e:
            print(e, "Raised Exception")
            
        sender = await self.get_user(sender_id)
        recipient = await self.get_user(recipient_id)

        timestamp = timezone.now()  
        formatted_timestamp = timestamp.strftime("%Y-%m-%d %H:%M:%S")  

        response_message = {
            'message': message,
            'recipient_id': recipient_id,
            'sender_id': sender_id,
            "attachment": file_name,
            'formatted_timestamp': formatted_timestamp,
            'sender_full_name': f"{sender.first_name} {sender.last_name}",
            'recipient_full_name': f"{recipient.first_name} {recipient.last_name}"
        }

        await self.send(text_data=json.dumps(response_message))

        

    @sync_to_async
    def get_old_messages(self):
        """
        Fetches the last 50 messages from the database for the chat session. This method is used to populate the chat history
        when a user initially connects to the chat. It ensures that users can view recent conversations upon joining the chat.
        Messages are annotated with additional details such as sender and recipient full names and formatted timestamps.
        """
        return list(
            Message.objects.all().annotate(
                sender_full_name=Concat('sender__first_name', Value(' '), 'sender__last_name',
                                        output_field=CharField()),
                recipient_full_name=Concat('recipient__first_name', Value(' '), 'recipient__last_name',
                                           output_field=CharField()),
                formatted_timestamp=Cast('timestamp', output_field=CharField())
            ).values('sender_id', 'recipient_id', 'message', 'formatted_timestamp',
                     'sender_full_name', 'recipient_full_name', 'attachment')  
            .order_by('timestamp')[:50]
        )

    @sync_to_async
    def save_message(self, message, recipient_id, sender_id, attachment=None):
        stored_message = Message.objects.create(
            sender_id=sender_id,
            recipient_id=recipient_id,
            message=message,
            attachment=attachment  # Store the encoded file data
        )

        data = {'message': stored_message.message,
                'recipient_id': stored_message.recipient_id,
                'sender_id': stored_message.sender_id,
                'file_name': True}
        EmailThreading(data).start()

        






    


