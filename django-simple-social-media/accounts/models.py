#this for login
from django.contrib import auth
from django.db import models
from django.utils import timezone

# Create your models here.
class User(auth.models.User, auth.models.PermissionsMixin):
    
    #username attribute is defined builtin from .User
    def __str__(self):
        return "@{}".format(self.username)
