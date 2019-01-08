from django import forms

from formprocessor import models


class PostForm(forms.ModelForm):
    class Meta:
        fields = ("form_data",)
        model = models.SavedFormData


# class PostForm(forms.ModelForm):
#     form_data= models.TextField()

