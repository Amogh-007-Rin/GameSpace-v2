from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, CustomTokenObtainPairView, UserProfileView,
    GameListView, LibraryEntryCreateView, LibraryEntryDetailView # Add these imports
)

urlpatterns = [
    # Auth Endpoints (Page 15)
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', CustomTokenObtainPairView.as_view(), name='login'),
    
    # Standard JWT Refresh (Keep session alive)
    path('auth/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile Endpoint
    path('users/me', UserProfileView.as_view(), name='user-profile'),
    # Game Endpoints
    path('games/', GameListView.as_view(), name='game-list'),

    # Library Endpoints
    path('library/', LibraryEntryCreateView.as_view(), name='library-list-create'),
    path('library/<int:pk>/', LibraryEntryDetailView.as_view(), name='library-detail'),
]