# FORM PROCESSOR VIEWS 
from django.views.generic import TemplateView
from formprocessor.forms import PostForm, OptionsForm
from formprocessor.models import SavedFormData, SavedCheckboxData, SavedSelectData, SavedOptionsData
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.shortcuts import render
from django.template import loader
import json 
from django.core import serializers

# ----------------------------------------------------------------------------------
#VIEW FOR FORM CREATION. HANDLES SAVING OF FORM
class FormDragPage(TemplateView):
    template_name = 'formprocessor/formprocessor.html'

    def post(self,request):
       
        if request.method == "POST":       

            form = PostForm(request.POST)

            print(request.POST.get('form_data',''))
            
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

                #   form not valid
            else:
                form = SavedFormData()

           
            return render(request, "formprocessor/failtoupload.html")


# -----------------------------------------------------------------------------------
# VIEW WHICH HANDLES THE SAVING OF OPTIONS
def save_options(request):

    if request.method == "POST":
        form = OptionsForm(request.POST)       
            
        if form.is_valid():                 
            options_name = request.POST.get('options_name','')            
            options_data = request.POST.get('options_data','')           

            # save to database
            options_data_obj = SavedOptionsData(options_name= options_name, options_data= options_data)
            options_data_obj.save()
            
            # fetching no httpresponse. This is not to redirect to another page
            return HttpResponse()

        else:
            form = SavedOptionsData()

        # fetching no httpresponse. This is not to redirect to another page
        return HttpResponse()

# -----------------------------------------------------------------------------------
# VIEW WHICH HANDLES REQUEST FOR LIST OF OPTIONS
def request_options(request):
    print('request on')
    #  need to serialize as type is queryset. 
    saved_options = serializers.serialize('json',list(SavedOptionsData.objects.all()))

    

    # saved_options = json.dumps(SavedOptionsData.objects.all())
    
    print(saved_options)
    # print(type(saved_options))
    # <class 'django.db.models.query.QuerySet'>

    # return HttpResponse({'mystring': saved_options})
    return HttpResponse(json.dumps({'mystring': saved_options}))
    


 


           



    

