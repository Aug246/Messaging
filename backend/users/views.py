from django.contrib.auth import get_user
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import ChatRoom, Message
import json
from collections import defaultdict

def setRoomName(username, friend_username):
    user = User.objects.get(username=username)
    userID = user.id
    friend_user = User.objects.get(username=friend_username)
    friend_userID = friend_user.id
    
    if (userID > friend_userID):
        roomName = f"{username}-{friend_username}"
    else:
        roomName = f"{friend_username}-{username}"
        
    return roomName

def is_user_registered(request):
    roomExists = False
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        friend_username = str(data.get('username'))
        username = str(get_user(request))
                    
        if(username != friend_username):
            if User.objects.filter(username=friend_username).exists():
                
                user = User.objects.get(username=username)
                userID = user.id
                friend_user = User.objects.get(username=friend_username)
                friend_userID = friend_user.id
                
                if (userID > friend_userID):
                    roomName = f"{username}-{friend_username}"
                else:
                    roomName = f"{friend_username}-{username}"
                
                try:
                    room = ChatRoom.objects.get(name=roomName)
                except ChatRoom.DoesNotExist:
                    newChatRoom = ChatRoom(name=roomName)
                    newChatRoom.save()
                    
                friend_username = User.objects.get(username=friend_username).get_full_name()
                return JsonResponse({"success": True, "message": "User Exists", "username": friend_username})
            else: 
                return JsonResponse({"success": False, "message": "User does not exist"})
        else:
            return JsonResponse({"success": False, "message": "User cannot be yourself"})
        
    return JsonResponse({"success": False, "message": "Only POST requests are allowed."})


def sendMessage(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        message = str(data.get('text'))
        friend_username = str(data.get('username'))
        username = str(get_user(request))
        roomName = setRoomName(username, friend_username)
        
        newMessage = Message(user=User.objects.get(username=username), chat_room=ChatRoom.objects.get(name=roomName), content=message)
        newMessage.save()
        
        return JsonResponse({"success": True, "message": "Message Sent"})
                            
    return JsonResponse({"success": False, "message": "Only POST requests are allowed."})


def returnChats(request):
    if request.method == 'GET':
        username = str(get_user(request))
        chats = ChatRoom.objects.all().order_by('-created_at')
        user_chats = []
        user_message = defaultdict(list)
        for chat in chats:
            if username in chat.name:
                cleaned_chat_name = chat.name.replace(username, "").replace("-", "")
                user = User.objects.get(username=cleaned_chat_name).get_full_name()
                user_chats.append((user, cleaned_chat_name))
                                  
                messages = Message.objects.filter(chat_room=chat)
                for message in messages:
                    user_message[user].append(message.content)
                    
        
        user_message = dict(user_message) 
        return JsonResponse({"success": True, "chats": user_chats, "messages": user_message})
    else:
        return JsonResponse({"success": False, "message": "Only POST requests are allowed."})
    
    
    
    
    
        
        
