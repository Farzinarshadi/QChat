from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    image = models.ImageField(upload_to='chat/')
    name = models.CharField(max_length=999)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_owner")
    members = models.ManyToManyField(User, related_name='chat_members')
    verify = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.name} - {self.owner.first_name}'
