from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from backend.core.models import File, Library

class UploadFile(APIView):
    http_method_names = ['put']
    parser_classes = [MultiPartParser]

    def put(self, request):
        file = request.data['file']
        owner = request.user
        library = Library.objects.filter(user=owner, pk=request.data.get('library_id', 0)).get()
        description = request.data.get('description', '')
        meta_data = request.data.get('meta_data', None)
        if not file:
            return Response({"message": "no file is found"}, status=401)
        if not library:
            return Response({"message": "libary not found"}, status=401)
        
        file_object = File(
            file=file,
            owner=owner,
            library=library,
            description=description,
            meta_data=meta_data    
        )
        return Response({"message": "success", "file": file_object}, status=200)