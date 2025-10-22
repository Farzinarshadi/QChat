from django.urls import path
from . import views

app_name = "auth_app"

urlpatterns = [
    path('<str:type>/', views.auth_view , name="auth_view"),
    path('get_user/<int:user_id>/', views.get_user , name="get_user"),
]