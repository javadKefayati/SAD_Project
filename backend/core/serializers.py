from django.contrib.auth.models import User
from rest_framework import serializers

from core.models import Library

class LibrarySerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    data_type = serializers.CharField()

    class Meta:
        model = Library
        fields = ['name', 'data_type']


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name']