from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models.aggregates import Count

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
        if not name:
            return Response(data={"message": "name is required"}, status=401)
        
        library = Library()
        library.name = name
        library.data_type = data_type
        library.user = request.user
        try:
            library.save()
        except:
            return Response(data={"message": "library with this name exists"}, status=401)
        return Response({"message": "successfully created library", "library": LibrarySerializer(library).data}, status=200)


class ViewLibraries(APIView):
    http_method_names = ['get']

    def get(self, request):
        user = request.user
        libraries = Library.objects.annotate(file_count=Count('file')).filter(user=user)
        selected_type = request.query_params.get('type')
        data_types = [i[1] for i in DATA_TYPES]
        if (selected_type in data_types):
            libraries = libraries.filter(data_type=selected_type)
        libraries = libraries.all()

        return Response({"message": "success", "libraries": LibrarySerializer(libraries, many=True).data}, status=200)


class DeleteLibrary(APIView):
    http_method_names = ['delete']

    def delete(self, request):
        library = Library.objects.filter(name=request.data.get('name', None), user=request.user)
        if not library:
            return Response({"message": "library not found"}, status=401)
        
        library.delete()
        return Response({"message": "successfully deleted library"}, status=200)