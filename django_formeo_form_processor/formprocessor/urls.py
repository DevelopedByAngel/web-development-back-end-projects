# FORM PROCESSOR URLS.PY

from django.urls import path
from . import views
from django.conf.urls import url

app_name='formprocessor'

urlpatterns = [
    # path('', views.index, name='index'),
    url(r"^$", views.FormProcessorPage.as_view(), name="index"),
    url(r"^new/", views.SaveForm, name="saveform")
]