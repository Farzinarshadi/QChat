from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view , permission_classes
from . import models
from .serializers import GroupsSerializer, MessageSerializer
from rest_framework import generics
from django.db.models import Q
from django.contrib.auth.models import User


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_groups(request):
    try:
        user = request.user
        groups = models.Chat.objects.all()
        serializer = GroupsSerializer(groups, many=True)
        return Response(serializer.data, status=200)

    except Exception as e:
        print("Error:", e)
        return Response({"error": str(e)}, status=500)  
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_group(request, id):
    try:
        group = models.Chat.objects.filter(id=id).first()
        serializer = GroupsSerializer(group)
        return Response(serializer.data, status=200)

    except Exception as e:
        print("Error:", e)
        return Response({"error": str(e)}, status=500)  


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_inbox(request):
    user = User.objects.get(id=request.user.id)

    chat_users = User.objects.filter(
        Q(sender__reciver=user) | Q(reciver__sender=user)
    ).distinct()

    last_messages = []

    for u in chat_users:
        last_msg = models.Message.objects.filter(
            Q(sender=user, reciver=u) | Q(sender=u, reciver=user)
        ).order_by('-id').first()

        if last_msg:
            last_messages.append(last_msg)

    last_messages.sort(key=lambda m: m.id, reverse=True)

    serializer = MessageSerializer(last_messages, many=True)
    return Response(serializer.data, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, sender_id, reciver_id):
    try:
        messages = models.Message.objects.filter(
            sender__in=[sender_id,reciver_id],
            reciver__in=[sender_id,reciver_id]
        )
        serializer = MessageSerializer(messages , many=True)
        return Response(serializer.data,status=200)
    except Exception as e:
        return Response(e,status=400)


class SendMessage(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes=[IsAuthenticated]

