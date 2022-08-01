from django.db import models
from django.contrib.auth.models import User
from . import FileLink

class LinkAccess(models.Model):
    url = models.ForeignKey(to=FileLink, on_delete=models.CASCADE)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)