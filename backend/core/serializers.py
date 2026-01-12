from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Game, LibraryEntry

User = get_user_model()

# --- 1. Registration Serializer ---
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'role']

    def create(self, validated_data):
        # We must use create_user to ensure password is hashed
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data.get('role', 'GAMER')
        )
        return user

# --- 2. Custom Login Serializer (Page 15 requirement) ---
# We extend the default JWT serializer to add User data to the response
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default validation generates the tokens
        data = super().validate(attrs)

        # Add custom data to the response (as per Page 15 Example)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
            'avatar_url': self.user.avatar_url
        }
        return data

# --- 3. Public Profile Serializer ---
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'avatar_url', 'bio', 'date_joined']


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

# --- 5. Library Entry Serializer ---
class LibraryEntrySerializer(serializers.ModelSerializer):
    # Nested serializer to show full game details, not just ID, when fetching library
    game_details = GameSerializer(source='game', read_only=True)
    
    class Meta:
        model = LibraryEntry
        fields = ['id', 'user', 'game', 'game_details', 'status', 'added_at']
        read_only_fields = ['user', 'added_at'] # User is set automatically from request

    def create(self, validated_data):
        # The view handles passing the user, but we double check here if needed
        return super().create(validated_data)