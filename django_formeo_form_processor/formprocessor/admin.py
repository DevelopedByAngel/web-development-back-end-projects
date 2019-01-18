from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.SavedFormData)
admin.site.register(models.SavedCheckboxData)
admin.site.register(models.SavedSelectData)
admin.site.register(models.SavedOptionsData)


