from django.conf import settings
from django.db import models
from django.urls import reverse

import misaka

# Create your models here.
#post models.py

from groups.models import  Group

#connect the current post to the current user
from django.contrib.auth import get_user_model
User = get_user_model()


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    #auto_now = True so that date and time is connected automatically when they post
    created_at = models.DateTimeField(auto_now=True)
    message = models.TextField()
    message_html = models.TextField(editable=False)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="posts",null=True, blank=True)

    def __str__(self):
        return self.message

    def save(self, *args, **kwargs):
        self.message_html = misaka.html(self.message)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse(
            "posts:single",
            kwargs={
                "username": self.user.username,
                "pk": self.pk
            }
        )

    #- negative in created_at is to order them in descending.
    class Meta:
        ordering = ["-created_at"]
        unique_together = ["user", "message"]
