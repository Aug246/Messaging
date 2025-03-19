from django.urls import path
from . import views

urlpatterns = [
    path('userexists/', views.is_user_registered),
    path('sendmessage/', views.sendMessage),
    path('returnrooms/', views.returnChats),

]