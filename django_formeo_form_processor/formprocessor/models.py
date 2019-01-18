from django.db import models

class SavedFormData(models.Model):
    form_name = models.CharField(max_length=15)
    # this is the original form data
    form_data = models.TextField()

    #this is the form data with the other fields only 
    form_data_mod = models.TextField()
    # # this is the extracted fields of other data other than checkbox and select
    # form_data_other_fields = models.TextField()
  
class SavedCheckboxData(models.Model):
    # this is the extracted fields for checkbox
    form_name = models.CharField(max_length=15)
    form_data_checkbox = models.TextField()
    
    #foreign key linking to original saved form data 
    saved_form_data = models.ForeignKey(SavedFormData, on_delete=models.CASCADE)

class SavedSelectData(models.Model):
    # this is the extracted fields for select
    form_name = models.CharField(max_length=15)
    form_data_select= models.TextField()

    #foreign key linking to original saved form data 
    saved_form_data = models.ForeignKey(SavedFormData, on_delete=models.CASCADE)

class SavedOptionsData(models.Model):
    options_name = models.CharField(max_length=15)
    options_data = models.TextField()





