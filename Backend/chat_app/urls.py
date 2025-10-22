from django.urls import path
from . import views

app_name = "chat_app"

urlpatterns = [
    path('get_groups/' , views.get_groups, name="get_groups"),
    path('get_group/<int:id>/' , views.get_group, name="get_group"),
    path('get_inbox_messages/' , views.my_inbox, name="get_message"),
    path('get_messages/<int:sender_id>/<int:reciver_id>/' , views.get_messages, name="get_messages"),
    path('send_message/' , views.SendMessage.as_view(), name="send_message"),
]