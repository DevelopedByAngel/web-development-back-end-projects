# from django.shortcuts import render
# from django.http import HttpResponse

# # Create your views here.
# def index(request):
#     return HttpResponse("This is the homepage of Form Processor")

# FORM RENDER VIEWS 
from django.views.generic import TemplateView
from formprocessor.forms import PostForm
from formprocessor.models import SavedFormData
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.shortcuts import render
from django.template import loader
import json


def form_render_page(request):
    template = 'formrender/formrender.html'
    req_id = request.GET.get('id')
    saved_template = json.dumps(SavedFormData.objects.get(id=req_id).form_data)
    print(type(SavedFormData.objects.get(id=req_id).form_data))

    context = {
        'savedTemplate': saved_template,
    }

    return render(request, template, context)