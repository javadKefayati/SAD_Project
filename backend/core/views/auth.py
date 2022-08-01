from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User

class RegisterUser(APIView):
    http_method_names = ['post']

    def post(self, request):
        if not request.username or not request.password:
            return Response(data={"message": "username and password are required"}, status=401)
        
        user = User()
        user.username = request.username
        user.set_password(request.password)
        try:
            user.save()
            return Response(data={"message": "user registered successfully", "user": user}, status=200)
        except:
            return Response(data={"message": "user with this username already exists"}, status=401)