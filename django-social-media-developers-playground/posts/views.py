#Social Clone Part Nine

from django.shortcuts import render

from . import forms
from . import models


# Create your views here.
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages

from django.urls import reverse_lazy
#this for CBV
from django.http import Http404
from django.views import generic

#must pip install django-braces
from braces.views import SelectRelatedMixin


from django.contrib.auth import get_user_model
User = get_user_model()

#select group see all post
class PostList(SelectRelatedMixin, generic.ListView):
    #Mixin allows you to provide a tuple or list of related models to perform a sected_related on. Basically the foreign keys for this post
    #user that the post /groups that the post belong to.
    model = models.Post
    select_related = ("user", "group")


class UserPosts(generic.ListView):
    model = models.Post
    template_name = "posts/user_post_list.html"

    # just to make sure that the user exist and you are able to fetch the post that is connected to that user using the iexact
    def get_queryset(self):
        #set post.user (the user that belongs to the user for this particular post. get the username  of what ever username you clicked)
        try:
            self.post_user = User.objects.prefetch_related("posts").get(
                username__iexact=self.kwargs.get("username")
            )
        except User.DoesNotExist:
            raise Http404
        else:
            return self.post_user.posts.all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["post_user"] = self.post_user
        #return context data object that is connected to whoever actually posted that specific user
        return context


class PostDetail(SelectRelatedMixin, generic.DetailView):
    model = models.Post
    select_related = ("user", "group")

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(
            user__username__iexact=self.kwargs.get("username")
        )


class CreatePost(LoginRequiredMixin, SelectRelatedMixin, generic.CreateView):
    # form_class = forms.PostForm
    fields = ('message','group')
    model = models.Post

    # def get_form_kwargs(self):
    #     kwargs = super().get_form_kwargs()
    #     kwargs.update({"user": self.request.user})
    #     return kwargs

    #to connect to post to the actual user themselves.

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.user = self.request.user
        self.object.save()
        return super().form_valid(form)


class DeletePost(LoginRequiredMixin, SelectRelatedMixin, generic.DeleteView):
    model = models.Post
    select_related = ("user", "group")
    success_url = reverse_lazy("posts:all")

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(user_id=self.request.user.id)

    def delete(self, *args, **kwargs):
        messages.success(self.request, "Post Deleted")
        return super().delete(*args, **kwargs)
