from django.db import models
from django.contrib.auth.models import User
from . import DATA_TYPES

class Library(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    data_type = models.CharField(max_length=1, choices=DATA_TYPES)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'name'], name='user_name_unique_library')
        ]