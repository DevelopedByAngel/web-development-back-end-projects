from django.shortcuts import render
from formprocessor.models import SavedFormData

def index(request):
    saved_forms = SavedFormData.objects.all().order_by("-id")
    return render(request, "index.html", {"SavedForms": saved_forms})


