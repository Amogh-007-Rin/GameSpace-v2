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
from itertools import chain
from operator import attrgetter
from .models import Follow, ForumThread
from .serializers import ForumThreadSerializer

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
    
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView # Using APIView for custom transaction logic
from rest_framework import status
from .models import Review

# ... existing views ...

# --- 7. Create Review View (Atomic Transaction - Snippet-04) ---
class ReviewCreateView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data
        user = request.user
        game_id = data.get('game_id') or data.get('game') # Handle both inputs

        # 1. Validation before transaction
        if not game_id:
            return Response({"error": "Game ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 2. ATOMIC BLOCK (The Core Logic)
            with transaction.atomic():
                # Check for existing review (Locking logic implied)
                if Review.objects.filter(user=user, game_id=game_id).exists():
                    raise ValueError("You have already reviewed this game.")

                # Create the review
                review = Review.objects.create(
                    user=user,
                    game_id=game_id,
                    rating=data['rating'],
                    comment=data.get('comment', '')
                )

                # 3. Trigger Game Update
                game = Game.objects.get(id=game_id)
                game.update_average_rating()

                return Response({
                    "success": True, 
                    "data": {"id": review.id, "rating": review.rating}
                }, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_409_CONFLICT)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

# --- 8. Follow User View (Page 17) ---
class FollowUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, user_id):
        # 1. Prevent Self-Follow (Sad Path Page 17)
        if request.user.id == user_id:
            return Response(
                {"error": "You cannot follow yourself."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 2. Check if already following
        if Follow.objects.filter(follower=request.user, following_id=user_id).exists():
            return Response(
                {"error": "You are already following this user."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Create Follow
        try:
            Follow.objects.create(follower=request.user, following_id=user_id)
            return Response({"success": True, "message": "Followed successfully."})
        except Exception as e:
            return Response({"error": "User not found or invalid ID."}, status=status.HTTP_404_NOT_FOUND)

class UnfollowUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, user_id):
        deleted_count, _ = Follow.objects.filter(
            follower=request.user, 
            following_id=user_id
        ).delete()
        
        if deleted_count > 0:
            return Response({"success": True, "message": "Unfollowed successfully."})
        return Response({"error": "You were not following this user."}, status=status.HTTP_400_BAD_REQUEST)


# --- 9. Activity Feed View (Page 17 Complex Query) ---
class ActivityFeedView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        # 1. Get list of user IDs I am following
        following_ids = request.user.following.values_list('following_id', flat=True)

        # 2. Fetch recent Reviews from these users
        recent_reviews = Review.objects.filter(user_id__in=following_ids).select_related('user', 'game').order_by('-created_at')[:10]

        # 3. Fetch recent Library Updates from these users
        recent_library = LibraryEntry.objects.filter(user_id__in=following_ids).select_related('user', 'game').order_by('-added_at')[:10]

        # 4. Combine and Sort in Python
        # We transform them into a standardized dictionary format
        feed_data = []

        for r in recent_reviews:
            feed_data.append({
                "type": "REVIEW",
                "user": r.user.username,
                "game": r.game.title,
                "rating": r.rating,
                "timestamp": r.created_at
            })

        for l in recent_library:
            feed_data.append({
                "type": "STATUS",
                "user": l.user.username,
                "game": l.game.title,
                "status": l.status,
                "timestamp": l.added_at
            })

        # Sort combined list by timestamp descending (newest first)
        feed_data.sort(key=lambda x: x['timestamp'], reverse=True)

        return Response({"success": True, "data": feed_data})


# --- 10. Forum Views ---
class ForumThreadListCreateView(generics.ListCreateAPIView):
    serializer_class = ForumThreadSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        game_id = self.kwargs['game_id']
        return ForumThread.objects.filter(game_id=game_id).order_by('-created_at')

    def perform_create(self, serializer):
        game_id = self.kwargs['game_id']
        game = get_object_or_404(Game, pk=game_id)
        serializer.save(user=self.request.user, game=game)