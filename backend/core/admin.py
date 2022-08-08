from django.contrib import admin

from core.models import File, FileLink, Library, LinkAccess

# Register your models here.
admin.site.register(Library)
admin.site.register(File)
admin.site.register(FileLink)
admin.site.register(LinkAccess)