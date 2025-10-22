from rest_framework import serializers
from django.contrib.auth.models import User
from . import models


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model =  models.CustomProfile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    custom_profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = '__all__'