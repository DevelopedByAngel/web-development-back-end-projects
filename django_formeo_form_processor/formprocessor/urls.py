# FORM PROCESSOR URLS.PY
from . import views
from django.conf.urls import url

app_name='formprocessor'

urlpatterns = [    
    url(r"^$", views.FormDragPage.as_view(), name="form_drag"),    
]