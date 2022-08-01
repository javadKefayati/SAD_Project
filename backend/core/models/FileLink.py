from django.db import models
from django.contrib.auth.models import User
from . import File, ACCESS_TYPES, LinkAccess

class FileLink(models.Model):
    url = models.SlugField(max_length=100)
    file = models.ForeignKey(to=File)
    access_type = models.CharField(max_length=2, choices=ACCESS_TYPES)
    revoked_at = models.DateTimeField(null=True)
    access_users = models.ManyToManyField(to= User,through=LinkAccess)