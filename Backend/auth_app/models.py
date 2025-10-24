from django.db import models
from django.contrib.auth.models import User

class CustomProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='custom_profile')
    image = models.ImageField(upload_to='profile/')
    bio = models.CharField(max_length=9999, null=True, blank=True)

    def __str__(self):
        return self.user.username
