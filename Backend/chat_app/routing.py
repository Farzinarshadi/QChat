from django.urls import path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    path('ws/chat/<int:sender>/<int:reciver>/', ChatConsumer.as_asgi()),
]
