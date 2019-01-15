# from django.shortcuts import render
# from django.http import HttpResponse

# # Create your views here.
# def index(request):
#     return HttpResponse("This is the homepage of Form Processor")

# FORM RENDER VIEWS 
from django.views.generic import TemplateView
from formprocessor.forms import PostForm
from formprocessor.models import SavedFormData, SavedCheckboxData, SavedSelectData
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.shortcuts import render
from django.template import loader
import json
import ast


def form_render_page(request):
    template = 'formrender/formrender.html'
    req_id = request.GET.get('id')
    
    
    # this code is for direct loading of whole original json file. 
    # print(type(SavedFormData.objects.get(id=req_id).form_data))
    # saved_template = json.dumps(SavedFormData.objects.get(id=req_id).form_data)

    #this is the code to  be used if  you want to combine fields for checkbox, select, other
    saved_mod = SavedFormData.objects.get(id=req_id).form_data_mod
    # use ast literal to convert string to python dict
    saved_mod = ast.literal_eval(saved_mod)

    # get fields other
    saved_mod_fields = saved_mod['fields']   

  
    check_box = SavedCheckboxData.objects.get(saved_form_data= req_id).form_data_checkbox
    check_box = ast.literal_eval(check_box)

    select =SavedSelectData.objects.get(saved_form_data= req_id).form_data_select
    select= ast.literal_eval(select)


    # combine the fields dictionaries 

    saved_mod_fields.update(check_box)
    saved_mod_fields.update(select)

    #update save_mod fields
    saved_mod['fields'] = saved_mod_fields

    # ready to send to client
    saved_template = json.dumps(saved_mod)


    context = {
        'savedTemplate': saved_template,
    }

    return render(request, template, context)