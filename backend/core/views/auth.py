from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User

from core.serializers import UserSerializer

class RegisterUser(APIView):
    http_method_names = ['post']
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        if 'username' not in request.data or 'password' not in request.data:
            return Response(data={"message": "username and password are required"}, status=401)
        
        user = User()
        user.username = request.data.get('username')
        user.set_password(request.data.get('password'))
        try:
            user.save()
            return Response(data={"message": "user registered successfully", "user": UserSerializer(user).data}, status=200)
        except:
            return Response(data={"message": "user with this username already exists"}, status=401)


class EditProfile(APIView):
    http_method_names = ['post']

    def post(self, request):
        first_name = request.data.get('first_name', None)
        last_name = request.data.get('last_name', None)

        user = request.user
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        user.save()
        return Response(data={"message": "saved successfully", "user": UserSerializer(user).data}, status=200)