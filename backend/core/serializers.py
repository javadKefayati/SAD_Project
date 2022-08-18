from dbm.ndbm import library
from django.contrib.auth.models import User
from rest_framework import serializers

from core.models import File, Library

class LibrarySerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    data_type = serializers.CharField()
    file_count = serializers.IntegerField()

    class Meta:
        model = Library
        fields = ['name', 'data_type', 'file_count']


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name']


class FileSerializer(serializers.ModelSerializer):
    file = serializers.FileField()
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
    

    class Meta:
        model = User
        fields = ['file', 'library', 'owner', 'description', 'meta_data']