# from django.shortcuts import render
# from django.http import HttpResponse

# # Create your views here.
# def index(request):
#     return HttpResponse("This is the homepage of Form Processor")

# FORM PROCESSOR VIEWS 
from django.views.generic import TemplateView
from formprocessor.forms import PostForm
from formprocessor.models import SavedFormData
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.shortcuts import render
from django.template import loader

class FormProcessorPage(TemplateView):
    template_name = 'formprocessor/formprocessor.html'
    # print(SavedFormData.objects.all())
    # print(SavedFormData.objects.get(pk=72))



def SaveForm(request):
    print(SavedFormData.objects.get(id=80).form_data)
    if request.method == "POST":       

        form = PostForm(request.POST)
        # print(request.POST)
        if form.is_valid():
            form_data = request.POST.get('form_data','')
            form_data_obj = SavedFormData(form_data= form_data)
            form_data_obj.save()
            # print("saving")
            template = loader.get_template("index.html")

            

            return HttpResponse(template.render(),request)
            # return HttpResponseRedirect(reverse("home"))
            # return render(request, "index.html")
        
        else:
            form = SavedFormData()

        # fix render.
        return render("/")