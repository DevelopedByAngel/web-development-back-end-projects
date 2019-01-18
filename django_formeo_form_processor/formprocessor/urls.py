# FORM PROCESSOR URLS.PY
from . import views
from django.conf.urls import url

app_name='formprocessor'

urlpatterns = [    
    url(r"^$", views.FormDragPage.as_view(), name="form_drag"),   
    url(r"saveoptions",views.save_options, name="save_options"),
    url(r"requestoptions",views.request_options, name="request_options"),

]