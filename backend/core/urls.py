from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    CustomTokenObtainPairView, 
    UserProfileView,
    # Add these imports if you are in Phase 3 or later:
    GameListView, GameDetailView, LibraryEntryCreateView, LibraryEntryDetailView, 
    ReviewCreateView, FollowUserView, UnfollowUserView, ActivityFeedView, ForumThreadListCreateView
)

urlpatterns = [
    # Auth Endpoints (Note the trailing slash '/')
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/me/', UserProfileView.as_view(), name='user-profile'),

    # Game & Library Endpoints
    path('games/', GameListView.as_view(), name='game-list'),
    path('games/<int:pk>/', GameDetailView.as_view(), name='game-detail'), # If you have a detail view logic reusing list view or separate
    path('library/', LibraryEntryCreateView.as_view(), name='library-list-create'),
    path('library/<int:pk>/', LibraryEntryDetailView.as_view(), name='library-detail'),

    # Review & Social Endpoints
    path('reviews/', ReviewCreateView.as_view(), name='create-review'),
    path('users/<int:user_id>/follow/', FollowUserView.as_view(), name='follow-user'),
    path('users/<int:user_id>/unfollow/', UnfollowUserView.as_view(), name='unfollow-user'),
    path('social/feed/', ActivityFeedView.as_view(), name='activity-feed'),
    path('games/<int:game_id>/threads/', ForumThreadListCreateView.as_view(), name='forum-threads'),
]


