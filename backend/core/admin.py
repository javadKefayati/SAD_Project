from django.contrib import admin

from core.models import File, FileAccess, Library

# Register your models here.
admin.site.register(Library)
admin.site.register(File)
admin.site.register(FileAccess)