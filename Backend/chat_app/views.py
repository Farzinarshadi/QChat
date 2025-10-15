from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view , permission_classes
from . import models
from .serializers import GroupsSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_groups(request):
    try:
        user = request.user
        groups = models.Chat.objects.filter(members=user)
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

