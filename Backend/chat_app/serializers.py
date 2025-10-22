from rest_framework import serializers
from .models import Chat, Message
from auth_app.models import CustomProfile
from django.contrib.auth.models import User


class GroupsSerializer(serializers.ModelSerializer):
    chat_members_count = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = '__all__'

    def get_chat_members_count(self, obj):
        return obj.members.count()



class MessageSerializer(serializers.ModelSerializer):
    sender_image = serializers.SerializerMethodField()
    reciver_image = serializers.SerializerMethodField()
    sender_name = serializers.SerializerMethodField()
    reciver_name = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'

    def get_sender_image(self, obj):
        try:
            profile = CustomProfile.objects.get(user=obj.sender)
            return profile.image.url if profile.image else None
        except CustomProfile.DoesNotExist:
            return None

    def get_reciver_image(self, obj):
        try:
            profile = CustomProfile.objects.get(user=obj.reciver)
            return profile.image.url if profile.image else None
        except CustomProfile.DoesNotExist:
            return None
        
    def get_sender_name(self, obj):
        try:
            user = User.objects.get(id=obj.sender.id)
            return user.username if user.username else None
        except CustomProfile.DoesNotExist:
            return None
        
    def get_reciver_name(self, obj):
        try:
            user = User.objects.get(id=obj.reciver.id)
            return user.username if user.username else None
        except CustomProfile.DoesNotExist:
            return None
