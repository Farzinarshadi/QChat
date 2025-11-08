import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, GroupMessage, Chat
from auth_app.models import CustomProfile
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model


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

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

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


class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender = str(self.scope['url_route']['kwargs']['sender'])
        self.reciver = str(self.scope['url_route']['kwargs']['reciver'])
        sender_id = int(self.sender)
        reciver_id = int(self.reciver)
        self.room_name = f'group_chat_{reciver_id}'

        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()

    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data.get('message')
        sender = data.get('sender')
        chat = data.get('reciver')

        message_object, sender_name, sender_image = await self.create_group_message(
            user=sender,
            sender=sender,
            chat=chat,
            message=message,
            is_read=False
        )

        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'id': message_object.id,
                'message': message_object.message,
                'sender': message_object.sender.id,
                'chat': message_object.chat.id,
                'is_read': message_object.is_read,
                'sender_name': sender_name,
                'sender_image': sender_image,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'message': event['message'],
            'sender': event['sender'],
            'chat': event['chat'],
            'is_read': event['is_read'],
            'sender_name': event['sender_name'],
            'sender_image': event['sender_image'],
        }))

    @database_sync_to_async
    def create_group_message(self, **kwargs):
        sender = User.objects.get(id=kwargs['sender'])
        chat = Chat.objects.get(id=kwargs['chat'])

        message_object = GroupMessage.objects.create(
            user=sender,
            sender=sender,
            chat=chat,
            message=kwargs['message'],
            is_read=kwargs.get('is_read', False)
        )

        sender_name = sender.username
        profile = CustomProfile.objects.filter(user=sender).first()
        sender_image = profile.image.url if profile and profile.image else None
        return message_object, sender_name, sender_image
    

User = get_user_model()
class OnlineStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query = self.scope["query_string"].decode()  
        token = query.split("token=")[-1] if "token=" in query else None

        if not token:
            await self.close()
            return

        try:
            access_token = AccessToken(token)
            self.user = await database_sync_to_async(User.objects.get)(id=access_token["user_id"])
        except Exception:
            await self.close()
            return

        await self.channel_layer.group_add("online_users", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "user"):
            profile = await self.get_user_profile()
            profile.is_active = False
            profile.last_seen = timezone.now()
            await database_sync_to_async(profile.save)()
            await self.channel_layer.group_discard("online_users", self.channel_name)
            

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")
        profile = await self.get_user_profile()

        if action == "online":
            profile.is_active = True
            profile.last_seen = timezone.now()
        elif action == "offline":
            profile.is_active = False
            profile.last_seen = timezone.now()

        await database_sync_to_async(profile.save)()

    @database_sync_to_async
    def get_user_profile(self):
        profile, _ = CustomProfile.objects.get_or_create(user=self.user)
        return profile
