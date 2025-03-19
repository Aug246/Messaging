from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
import json

@ensure_csrf_cookie
def get_csrf_token(request):
    """
    This view does nothing other than ensure a CSRF cookie is set
    """
    return JsonResponse({"success": True})


def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})

def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"success": True, "message": "Login successful!"})
        else:
            return JsonResponse({"success": False, "message": "Invalid username or password."})
    
    return JsonResponse({"success": False, "message": "Only POST requests are allowed."})


def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username')
        password = data.get('password')
        first_name = data.get('first_name','')
        last_name = data.get('last_name','')

        # Check if the username is already taken
        if User.objects.filter(username=username).exists():
            return JsonResponse({"success": False, "message": "Username already taken."})

        # Create and save the new user
        user = User.objects.create_user(username=username, password=password, first_name=first_name, last_name=last_name)
        user.save()


        return JsonResponse({"success": True, "message": "Account created successfully!"})

    return JsonResponse({"success": False, "message": "Only POST requests are allowed."})
