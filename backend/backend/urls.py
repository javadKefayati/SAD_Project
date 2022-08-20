"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as rest_views

from core.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-token-auth/', rest_views.obtain_auth_token, name='api-token-auth'),


    path('api/auth/register', RegisterUser.as_view()),
    path('api/auth/get-me', GetMe.as_view()),


    path('api/profile/edit', EditProfile.as_view()),


    path('api/library/create', CreateLibrary.as_view()),
    path('api/library/list', ViewLibraries.as_view()),
    path('api/library/delete', DeleteLibrary.as_view()),
    path('api/library/<name>/files', ViewFiles.as_view()),

    
    path('api/file/upload', UploadFile.as_view()),
    path('api/file/<pk>/delete', DeleteFile.as_view()),

    path('api/options/data-types', ViewDataTypes.as_view())
    
]