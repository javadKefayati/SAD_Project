from dbm.ndbm import library
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from core.serializers import FileSerializer
from core.models import File, Library

class UploadFile(APIView):
    http_method_names = ['put']
    parser_classes = [MultiPartParser]

    def put(self, request):
        file = request.data['file']
        owner = request.user
        library = Library.objects.filter(user=owner, name=request.data.get('library', None))
        description = request.data.get('description', '')
        meta_data = request.data.get('meta_data', None)
        if not file:
            return Response({"message": "no file is found"}, status=401)
        if not library:
            return Response({"message": "libary not found"}, status=401)
        
        file_object = File(
            file=file,
            owner=owner,
            library=library.get(),
            description=description,
            meta_data=meta_data
        )
        file_object.save()
        return Response({"message": "success", "file": FileSerializer(file_object).data}, status=200)


class ViewFiles(APIView):
    http_method_names = ['get']

    def get(self, request, name):
        #TODO: add pagination
        library = Library.objects.prefetch_related('file_set').filter(user=request.user, name=name)
        if not library:
            return Response({"message": "library not found"}, status=404)
        library = library.get()
        return Response(FileSerializer(library.file_set, many=True, context={'request': request}).data, status=200)