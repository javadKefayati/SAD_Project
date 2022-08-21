from django.contrib import admin

from core.models import File, FileAccess, FileAttachment, Library

# Register your models here.
admin.site.register(Library)
admin.site.register(File)
admin.site.register(FileAccess)
admin.site.register(FileAttachment)