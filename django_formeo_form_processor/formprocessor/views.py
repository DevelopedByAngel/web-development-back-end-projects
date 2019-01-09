# FORM PROCESSOR VIEWS 
from django.views.generic import TemplateView
from formprocessor.forms import PostForm
from formprocessor.models import SavedFormData
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render
from django.template import loader

class FormDragPage(TemplateView):
    template_name = 'formprocessor/formprocessor.html'

    def post(self,request):
       
        if request.method == "POST":       

            form = PostForm(request.POST)
            
            if form.is_valid():
                form_name = request.POST.get('form_name','')
                form_data = request.POST.get('form_data','')
                form_data_obj = SavedFormData(form_name= form_name, form_data= form_data)
                form_data_obj.save()
           
                template = loader.get_template("index.html")                
               
                return HttpResponseRedirect(reverse("index"))
                       
            else:
                form = SavedFormData()

           
            return render(request, "formprocessor/failtoupload.html")
