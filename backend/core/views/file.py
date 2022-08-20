from nis import cat
import os
from rest_framework.views import APIView
from django.http import FileResponse
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from core.serializers import FileSerializer, UserSerializer
from core.models import ACCESS_TYPES, File, FileAccess, Library

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
        return Response({"message": "success", "file": FileSerializer(file_object, context={'request': request}).data}, status=200)


class ViewFiles(APIView):
    http_method_names = ['get']

    def get(self, request, name):
        #TODO: add pagination
        library = Library.objects.prefetch_related('file_set').filter(user=request.user, name=name)
        if not library:
            return Response({"message": "library not found"}, status=404)
        library = library.get()
        return Response(FileSerializer(library.file_set, many=True, context={'request': request}).data, status=200)

class CRUDFile(APIView):
    http_method_names = ['delete', 'get']

    def delete(self, request, pk):
        file = File.objects.filter(pk=pk, owner=request.user)
        if not file:
            return Response({"message": "file not found"}, status=404)
        file = file.get()
        if os.path.isfile(file.file.path):
            os.remove(file.file.path)
        file.delete()
        return Response({"message": "deleted successfully"}, status=200)
    

    def get(self, request, pk):
        file = File.objects.filter(pk=pk, owner=request.user)
        if not file:
            file = FileAccess.objects.select_related('file').filter(file_id=pk, user=request.user)
            if not file:
                return Response({"message": "file not found"}, status=404)
            file = file.get().file
        else:
            file = file.get()
        file_handle = file.file.open()
        response = FileResponse(file_handle)
        response['Content-Length'] = file.file.size
        response['Content-Disposition'] = 'attachment; filename="%s"' % file.file.name
        return response

class ShareFile(APIView):
    http_method_names =['get', 'post', 'delete']

    def get(self, request, pk):
        file = File.objects.prefetch_related('fileaccess_set', 'fileaccess_set__user').filter(pk=pk, owner=request.user)
        if not file:
            return Response({"message": "file not found"}, status=404)
        file = file.get()
        accessed_users = map(lambda item: item.user, file.fileaccess_set.all())
        return Response(UserSerializer(accessed_users, many=True).data, status=200)
    

    def post(self, request, pk):
        file = File.objects.filter(pk=pk, owner=request.user)
        accesssed_user = User.objects.filter(username=request.data.get("username", ''))
        if not file:
            return Response({"message": "file not found"}, status=404)
        if not accesssed_user:
            return Response({"message": "user not found"}, status=404)
        
        access_type = request.data.get('access_type', '')
        if access_type not in map(lambda x:x[0], ACCESS_TYPES):
            return Response({"message": "invalid access type"}, status=401)
        
        file = file.get()
        accesssed_user = accesssed_user.get()
        try:
            file.fileaccess_set.create(
                user=accesssed_user,
                access_type=access_type
            )
        except:
            return Response({"message": "access already granted"}, status=400)
        return Response({"message": "access granted", "user": UserSerializer(accesssed_user).data}, status=200)
    
    def delete(self, request, pk):
        file = File.objects.filter(pk=pk, owner=request.user)
        if not file:
            return Response({"message": "file not found"}, status=404)
        file = file.get()
        fileaccess_obj = FileAccess.objects.filter(file=file, user__username=request.data.get('username', ''))
        if fileaccess_obj:
            fileaccess_obj = fileaccess_obj.get()
            fileaccess_obj.delete()
        return Response({"message": "access revoked"}, status=200)


class SharedList(APIView):
    http_method_names = ['get']

    def get(self, request):
        file_accesses = FileAccess.objects.select_related('file').filter(user=request.user).all()
        files = map(lambda item: item.file, file_accesses)
        return Response(FileSerializer(files, many=True, context={"request": request}).data, status=200)