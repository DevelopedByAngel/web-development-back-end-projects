from django.conf import settings
from django.urls import reverse
from django.db import models
#remove characters alphanumerics underscores and hyphens.  idea is you have a string that has spaces in it and you wnat to use that as part of url. it replaces spaces with dashes.
from django.utils.text import slugify
# from accounts.models import User


# Create your models here.
#groups models.py file
#allows link embedding. just like reddit commenting system put in links and markdown text
import misaka

from django.contrib.auth import get_user_model
User = get_user_model()

# https://docs.djangoproject.com/en/1.11/howto/custom-template-tags/#inclusion-tags
# This is for the in_group_members check template tag
from django import template
#how you can use custom template tags in the future.
register = template.Library()



class Group(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(allow_unicode=True, unique=True)
    description = models.TextField(blank=True, default='')
    description_html = models.TextField(editable=False, default='', blank=True)
    #many to many field all user in the group
    members = models.ManyToManyField(User,through="GroupMember")

    def __str__(self):
        return self.name

    #so this method saves the name without spaces by slugifying it.
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        self.description_html = misaka.html(self.description)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("groups:single", kwargs={"slug": self.slug})


    class Meta:
        ordering = ["name"]


class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="memberships")
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user_groups')

    def __str__(self):
        return self.user.username

    class Meta:
        unique_together = ("group", "user")
