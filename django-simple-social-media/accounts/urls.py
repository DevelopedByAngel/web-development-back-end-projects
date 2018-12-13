from django.conf.urls import url
#these is for Login View and logout view. in newer versions of django these are not needed anymore. Use this instead.
from . import views
from django.contrib.auth import views as auth_views


app_name = 'accounts'

urlpatterns = [
    url(r"login/$",#for loginview you need to connect it to a template
     auth_views.LoginView.as_view(template_name="accounts/login.html"),name='login'),
    url(r"logout/$", # for logout view there is a default tempate.
    auth_views.LogoutView.as_view(), name="logout"),
    url(r"signup/$", views.SignUp.as_view(), name="signup"),
]
