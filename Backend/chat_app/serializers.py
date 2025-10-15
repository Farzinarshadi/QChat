from rest_framework import serializers
from .models import Chat

class GroupsSerializer(serializers.ModelSerializer):
    chat_members_count = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = '__all__'

    def get_chat_members_count(self, obj):
        return obj.members.count()
