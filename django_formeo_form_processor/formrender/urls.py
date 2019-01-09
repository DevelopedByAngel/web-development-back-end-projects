# FORM RENDER URLS.PY

from django.urls import path
from . import views
from django.conf.urls import url

app_name='formrender'

urlpatterns = [  
    url(r"^$", views.form_render_page, name="form_save_render"),  
]