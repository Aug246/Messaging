from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view),
    path('register/', views.register_view),
    path('csrftoken/', views.get_csrf_token,),
    path('logout/', views.logout_view)
]