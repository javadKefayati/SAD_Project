from django.db import models
from django.contrib.auth.models import User
from jsonfield import JSONField
from . import Library

class File(models.Model):
    owner = models.ForeignKey(to=User, on_delete=models.SET_NULL)
    file = models.FileField(upload_to='files')
    library = models.ForeignKey(to=Library, null=True, on_delete=models.SET_NULL)
    description = models.CharField(max_length=100)
    meta_data = JSONField()