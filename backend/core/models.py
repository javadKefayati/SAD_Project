from django.db import models
from django.contrib.auth.models import User
from jsonfield import JSONField


DATA_TYPES = [
    (1, 'video'),
    (2, 'document'),
    (3, 'audio'),
    (4, 'image')
]

ACCESS_TYPES = [
    ('r', 'Read'),
    ('w', 'write')
]


class Library(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    data_type = models.CharField(max_length=1, choices=DATA_TYPES)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'name'], name='user_name_unique_library')
        ]


class File(models.Model):
    owner = models.ForeignKey(to=User, on_delete=models.SET_NULL, null=True)
    file = models.FileField(upload_to='files')
    library = models.ForeignKey(to=Library, null=True, on_delete=models.SET_NULL)
    description = models.CharField(max_length=100)
    meta_data = JSONField()


class FileLink(models.Model):
    url = models.SlugField(max_length=100)
    file = models.ForeignKey(to=File, on_delete=models.CASCADE)
    access_type = models.CharField(max_length=2, choices=ACCESS_TYPES)
    revoked_at = models.DateTimeField(null=True)


class LinkAccess(models.Model):
    url = models.ForeignKey(to=FileLink, on_delete=models.CASCADE)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)