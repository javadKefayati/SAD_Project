import os
from django.db import models
from django.contrib.auth.models import User
from jsonfield import JSONField
from backend.settings import MEDIA_ROOT
from django.dispatch import receiver


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

ATTACHMENT_TYPES = {
    "image": ["Related image"],
    "video": ["Subtitle", "Dubbed audio", "Back scenes"],
    "document": ["Related document", "Index"],
    "audio": ["Lyrics",]
}


class Library(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    data_type = models.CharField(max_length=1, choices=DATA_TYPES)
    

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'name'], name='user_name_unique_library')
        ]


class File(models.Model):
    owner = models.ForeignKey(to=User, on_delete=models.PROTECT, null=True)
    file = models.FileField(upload_to=MEDIA_ROOT)
    library = models.ForeignKey(to=Library, null=True, on_delete=models.CASCADE)
    description = models.CharField(max_length=100)
    meta_data = JSONField()


class FileAccess(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    file = models.ForeignKey(to=File, on_delete=models.CASCADE)
    access_type = models.CharField(max_length=2, choices=ACCESS_TYPES)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'file', 'access_type'], name='user_file_type_fileaccess')
        ]

class FileAttachment(models.Model):
    related = models.ForeignKey(to=File, on_delete=models.CASCADE, null=True)
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    file = models.FileField(upload_to=MEDIA_ROOT)


@receiver(models.signals.post_delete, sender=File)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

@receiver(models.signals.post_delete, sender=FileAttachment)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)