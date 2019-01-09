from django.db import models

class SavedFormData(models.Model):
    form_name = models.CharField(max_length=15)   
    form_data = models.TextField()
