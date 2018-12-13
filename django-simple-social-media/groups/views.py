from django.contrib import messages

# Create your views here.
from django.contrib.auth.mixins import(
    LoginRequiredMixin,
    PermissionRequiredMixin
)

from django.urls import reverse

#class based views are imported
from django.views import generic
from groups.models import Group,GroupMember

from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from . import models



class CreateGroup(LoginRequiredMixin, generic.CreateView):
    fields = ("name", "description")
    model = Group

#post inside a group etc. detailed view a group
class SingleGroup(generic.DetailView):
    model = Group

class ListGroups(generic.ListView):
    model = Group

# <!--Social Clone Part Eleven  -->
#once someone click on join do some stuff backend with our models. To join actual users to be a group memeber of that group.
#Then redirect to another page
class JoinGroup(LoginRequiredMixin, generic.RedirectView):

    def get_redirect_url(self, *args, **kwargs):
        return reverse("groups:single",kwargs={"slug": self.kwargs.get("slug")})

    def get(self, request, *args, **kwargs):
        #try to get a group that this person is looking at or return a 404 page.
        #error or warning messages if they are already a member
        group = get_object_or_404(Group,slug=self.kwargs.get("slug"))

        #if you didn't have the try except else here you will just have broken pages if the person is in the group or not in the group.
        try:
            #get the groupmember objects and create one that user = user and group =group
            GroupMember.objects.create(user=self.request.user,group=group)

        #you can write except you don't need to write Integrity error here.
        #send messge that hey you are already a member of that group if you are trying to join again.
        except IntegrityError:
            messages.warning(self.request,("Warning, already a member of {}".format(group.name)))

        else:
            messages.success(self.request,"You are now a member of the {} group.".format(group.name))

        return super().get(request, *args, **kwargs)


class LeaveGroup(LoginRequiredMixin, generic.RedirectView):

    #once you leave a group you will ber redirected to the groups detail page
    def get_redirect_url(self, *args, **kwargs):
        return reverse("groups:single",kwargs={"slug": self.kwargs.get("slug")})

    #this insures that they can't leave a group  if they are not in it.
    def get(self, request, *args, **kwargs):

        try:
            #try to get membership of that GroupMember assuming that he is part of that group
            membership = models.GroupMember.objects.filter(
                user=self.request.user,
                group__slug=self.kwargs.get("slug")
            ).get()

        except models.GroupMember.DoesNotExist:
            messages.warning(
                self.request,
                "You can't leave this group because you aren't in it."
            )
        else:
            membership.delete()
            messages.success(
                self.request,
                "You have successfully left this group."
            )
        return super().get(request, *args, **kwargs)
