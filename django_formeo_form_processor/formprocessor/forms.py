from django import forms
from formprocessor import models

class PostForm(forms.ModelForm):
    class Meta:
        fields = ("form_name","form_data",)
        model = models.SavedFormData

class OptionsForm(forms.ModelForm):
    class Meta:
        fields = ("options_name", "options_data",)
        model = models.SavedOptionsData
