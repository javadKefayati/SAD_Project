from rest_framework.views import APIView
from rest_framework.response import Response

from core.models import DATA_TYPES

class ViewDataTypes(APIView):
    http_method_names = ['get']
    permission_classes = []

    def get(self, request):
        data_types = [i[1] for i in DATA_TYPES]
        return Response({"message": "success", "data_types": data_types}, status=200)