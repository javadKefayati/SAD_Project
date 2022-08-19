from django.contrib.auth.models import User
from rest_framework import serializers

from core.models import File, Library

class LibrarySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    data_type = serializers.CharField()
    file_count = serializers.IntegerField(required=False, default=0)

    class Meta:
        model = Library
        fields = ['id', 'name', 'data_type', 'file_count']


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name']


class FileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    file = serializers.FileField()
    name = serializers.SerializerMethodField('get_file_name')
    size = serializers.SerializerMethodField('get_file_size')
    library = serializers.SerializerMethodField('get_library')
    owner = serializers.SerializerMethodField('get_owner')
    description = serializers.CharField()
    meta_data = serializers.JSONField()

    @staticmethod
    def get_library(file: File):
        if hasattr(file, 'library'):
            return LibrarySerializer(file.library).data
        return None
    
    @staticmethod
    def get_owner(file: File):
        if hasattr(file, 'owner'):
            return UserSerializer(file.owner).data
        return None

    @staticmethod
    def get_file_name(file: File):
        return file.file.name.split("/")[-1]
    
    @staticmethod
    def get_file_size(file: File):
        size = file.file.size
        if size < 9000:
            return f"{size} Bytes"
        elif size < 90000:
            return f"{(size / 1000):0.2f} KB"
        elif size < 900000:
            return f"{(size / 10000):0.2f} MB"
        elif size < 9000000:
            return f"{(size / 100000):0.2f} GB"
    

    class Meta:
        model = User
        fields = ['id', 'file', 'name', 'size', 'library', 'owner', 'description', 'meta_data']