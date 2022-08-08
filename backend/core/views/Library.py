from rest_framework.response import Response
from rest_framework.views import APIView

from core.serializers import LibrarySerializer

from ..models import DATA_TYPES, Library

class CreateLibrary(APIView):
    http_method_names = ['post']

    def post(self, request):
        name = request.data.get('name')
        data_type = request.data.get('data_type')
        data_types = [i[1] for i in DATA_TYPES]
        if data_type not in data_types:
            return Response(data={"message": "invalid data type"}, status=401)
        library = Library()
        library.name = name
        library.data_type = data_type
        library.user = request.user
        library.save()
        return Response({"message": "successfully created library", "library": LibrarySerializer(library).data}, status=200)


class ViewLibraries(APIView):
    http_method_names = ['get']

    def get(self, request):
        user = request.user
        libraries = Library.objects.filter(user=user).all()

        return Response({"message": "success", "libraries": LibrarySerializer(libraries, many=True).data}, status=200)