from rest_framework import serializers
from .models import Chat, Message, GroupMessage
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
    sender_name = serializers.SerializerMethodField()
    sender_online = serializers.SerializerMethodField()

    reciver_image = serializers.SerializerMethodField()
    reciver_name = serializers.SerializerMethodField()
    reciver_online = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'

    def get_sender_image(self, obj):
        profile = getattr(obj.sender, 'custom_profile', None)
        return profile.image.url if profile and profile.image else None

    def get_reciver_image(self, obj):
        profile = getattr(obj.reciver, 'custom_profile', None)
        return profile.image.url if profile and profile.image else None

    def get_sender_name(self, obj):
        return obj.sender.username if obj.sender else None

    def get_reciver_name(self, obj):
        return obj.reciver.username if obj.reciver else None

    def get_sender_online(self, obj):
        profile = getattr(obj.sender, 'custom_profile', None)
        return profile.is_active if profile else False

    def get_reciver_online(self, obj):
        profile = getattr(obj.reciver, 'custom_profile', None)
        return profile.is_active if profile else False



class GroupMessageSerializer(serializers.ModelSerializer):
    sender_image = serializers.SerializerMethodField()
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = GroupMessage
        fields = '__all__'
    
    def get_sender_image(self, obj):
        try:
            profile = CustomProfile.objects.get(user=obj.sender)
            return profile.image.url if profile.image else None
        except CustomProfile.DoesNotExist:
            return None
        
    def get_sender_name(self, obj):
        try:
            user = User.objects.get(id=obj.sender.id)
            return user.username if user.username else None
        except CustomProfile.DoesNotExist:
            return None
        