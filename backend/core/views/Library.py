from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import DATA_TYPES, Library

class CreateLibrary(APIView):
    http_method_names = ['post']

    def post(self, request):
        name = request.name
        data_type = request.data_type
        data_types = [i[1] for i in DATA_TYPES]
        if data_type not in data_types:
            return Response(data={"message": "invalid data type"}, status=401)
        library = Library()
        library.name = name
        library.data_type = data_type
        library.user = request.user
        library.save()
        return Response({"message": "successfully created library", "library": library}, status=200)