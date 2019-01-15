# FORM PROCESSOR VIEWS 
from django.views.generic import TemplateView
from formprocessor.forms import PostForm
from formprocessor.models import SavedFormData, SavedCheckboxData, SavedSelectData
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render
from django.template import loader
import json 


class FormDragPage(TemplateView):
    template_name = 'formprocessor/formprocessor.html'

    def post(self,request):
       
        if request.method == "POST":       

            form = PostForm(request.POST)
            
            if form.is_valid():
                form_name = request.POST.get('form_name','')
                # original form information(string)
                form_data = request.POST.get('form_data','')
                # convert into python dict(string)
                form_data_json = json.loads(form_data)
                
                # extract fields (dict)
                form_data_fields= form_data_json['fields']    

                # extract select_fields (dict)
                select_fields= {k: v for k, v in form_data_fields.items() if v.get('tag')=='select'}
                
                # extract checkbox_fields(dict)
                checkbox_fields= {k: v for k, v in form_data_fields.items() if v.get('attrs').get('type')=='checkbox'}
                
                # # extract other_fields not checkbox and select  (dict)
                other_fields = {k: v for k, v in form_data_fields.items() if (v.get('attrs').get('type')!='checkbox') and (v.get('tag')!='select') }

                
                # replace fileds with only other_fields included 
                form_data_json['fields'] = other_fields
              
                # form_data_obj = SavedFormData(form_name= form_name, form_data= form_data_json, form_data_other_fields = other_fields)
                form_data_obj = SavedFormData(form_name= form_name, form_data= form_data, form_data_mod =form_data_json)
                form_data_obj.save()

                checkbox_data_obj = SavedCheckboxData(form_name= form_name, form_data_checkbox= checkbox_fields, saved_form_data=form_data_obj)
                checkbox_data_obj.save()
                
                select_data_obj= SavedSelectData(form_name= form_name, form_data_select = select_fields, saved_form_data = form_data_obj)
                select_data_obj.save()


                template = loader.get_template("index.html")                
               
                return HttpResponseRedirect(reverse("index"))
                       
            else:
                form = SavedFormData()

           
            return render(request, "formprocessor/failtoupload.html")
