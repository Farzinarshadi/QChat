import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender = str(self.scope['url_route']['kwargs']['sender'])
        self.reciver = str(self.scope['url_route']['kwargs']['reciver'])

        self.room_name = f'private_chat_{min(self.sender, self.reciver)}_{max(self.sender, self.reciver)}'

        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket connected for room: {self.room_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )
        print(f"WebSocket disconnected from room: {self.room_name}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")
        sender_id = int(data.get("sender"))
        reciver_id = int(data.get("reciver"))
        is_read = data.get("is_read", False)

        message_obj = await self.create_message(
            sender_id=sender_id,
            reciver_id=reciver_id,
            message=message,
            is_read=is_read
        )


        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'id': message_obj.id,
                'message': message_obj.message,
                'sender': sender_id,
                'reciver': reciver_id,
                'is_read': message_obj.is_read
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def create_message(self, **kwargs):
        sender = User.objects.get(id=kwargs['sender_id'])
        reciver = User.objects.get(id=kwargs['reciver_id'])
        return Message.objects.create(
            user=sender,  
            sender=sender,
            reciver=reciver,
            message=kwargs['message'],
            is_read=kwargs.get('is_read', False)
        )

