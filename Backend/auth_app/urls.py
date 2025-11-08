from django.urls import path
from . import views

app_name = "auth_app"

urlpatterns = [
    path('update-profile/', views.update_profile , name="update_profile"),
    path('get_user/', views.get_user , name="get_user"),
    path('get_user_with_id/<int:user_id>/', views.get_user_with_id , name="get_user_with_id"),
    path('<str:type>/', views.auth_view , name="auth_view"),
]