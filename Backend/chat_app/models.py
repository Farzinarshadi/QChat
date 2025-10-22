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


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    reciver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reciver")
    message = models.CharField(max_length=1000)
    is_read = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']  


    def __str__(self):
        return f"{self.sender} - {self.reciver} - {self.message}"