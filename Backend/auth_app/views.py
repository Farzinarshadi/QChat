from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomProfile
from rest_framework.decorators import api_view, permission_classes
from ratelimit.decorators import ratelimit


def get_refresh_token(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@ratelimit(key='ip', rate='10/m', block=True)
@api_view(['POST'])
def auth_view(request, type):


    if type == "signin":

        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username , password=password)

        if user is None:
            return Response({'error':'username or password incorect'}, status=400)
        
        tokens = get_refresh_token(user)

        return Response({
            'tokens':tokens,
            'user_id':user.id
        })

    elif type == "signup":

        username = request.data.get('username')
        password = request.data.get('password')

        user = User.objects.filter(username=username).exists()

        if user:
            return Response({'error':'user is exists'}, status=400)
        
        
        user = User.objects.create_user(username=username, password=password)
        return Response({'success': 'user created successfully'}, status=200)

    else:
        return Response({'error':'type is not true'}, status=400)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    try:
        user_object = User.objects.get(id=request.user.id)
        serializer = UserSerializer(user_object)
        return Response(serializer.data, status=200)
    except Exception as e:
        return Response({'error':e},status=400)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_with_id(request , user_id):
    try:
        user_object = User.objects.get(id=user_id)
        serializer = UserSerializer(user_object)
        return Response(serializer.data, status=200)
    except Exception as e:
        print(e)
        return Response({'error': e},status=400)


@api_view(['POST'])
def update_profile(request):
    try:
        bio = request.data.get('bio')
        image = request.FILES.get('image')
        profile = CustomProfile.objects.filter(user=request.user).first()
        if not profile:
            CustomProfile.objects.create(
                user=request.user,
                image=image,
                bio=bio
            )
        else:
            if bio:
                profile.bio = bio
            if image:
                profile.image = image
            profile.save()
        return Response({'success':'success'}, status=200)
    except Exception as e:
        return Response({'error':f'{e}'}, status=400)
