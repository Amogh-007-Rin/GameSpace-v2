from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import (
    UserRegistrationSerializer, 
    CustomTokenObtainPairSerializer,
    UserProfileSerializer
)
from django.db.models import Count, Q
from .models import Game, LibraryEntry
from .serializers import GameSerializer, LibraryEntrySerializer

User = get_user_model()

# --- 1. Registration View ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

# --- 2. Login View ---
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# --- 3. User Profile View ---
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        # Returns the currently logged-in user
        return self.request.user
    

class GameListView(generics.ListAPIView):
    serializer_class = GameSerializer
    permission_classes = (AllowAny,) # Publicly accessible

    def get_queryset(self):
        queryset = Game.objects.all()
        
        # A. Filtering (Genre/Platform would strictly need fields in Model, 
        # but here we search text fields for simplicity based on your doc)
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | 
                Q(developer__icontains=search_query) |
                Q(publisher__icontains=search_query)
            )

        # B. Trending Logic (Wireframe Requirement)
        # Sort by number of library entries (popularity)
        trending = self.request.query_params.get('trending', None)
        if trending == 'true':
            queryset = queryset.annotate(
                popularity=Count('library_entries')
            ).order_by('-popularity')
            
        return queryset

# --- 5. Library Management View (Page 16) ---
class LibraryEntryCreateView(generics.ListCreateAPIView):
    serializer_class = LibraryEntrySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # Return only the current user's library
        return LibraryEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically associate the entry with the logged-in user
        serializer.save(user=self.request.user)

# --- 6. Library Detail View (Update/Delete) ---
class LibraryEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LibraryEntrySerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        # Ensure users can only edit/delete their own entries
        return LibraryEntry.objects.filter(user=self.request.user)