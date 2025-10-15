from django.urls import path
from . import views

app_name = "chat_app"

urlpatterns = [
    path('get_group/<int:id>/' , views.get_group, name="get_group"),
    path('get_groups/' , views.get_groups, name="get_groups"),
]