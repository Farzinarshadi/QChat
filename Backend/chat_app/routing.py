from django.urls import path
from .consumers import ChatConsumer, GroupChatConsumer,OnlineStatusConsumer

websocket_urlpatterns = [
    path('ws/chat/<int:sender>/<int:reciver>/', ChatConsumer.as_asgi()),
    path('ws/group/<int:sender>/<int:reciver>/', GroupChatConsumer.as_asgi()),
    path('ws/online/', OnlineStatusConsumer.as_asgi()),
]
