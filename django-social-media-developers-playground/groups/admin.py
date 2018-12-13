from django.contrib import admin

from . import models

# Register your models here.

# when in admin click on Group and see group memebers as well.
# the GroupMember is inline with GroupMemberInLine


class GroupMemberInline(admin.TabularInline):
    model = models.GroupMember



admin.site.register(models.Group)
