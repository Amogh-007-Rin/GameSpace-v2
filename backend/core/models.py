from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings

# --- 1. Custom User Model (Page 12) ---
class User(AbstractUser):
    class Roles(models.TextChoices):
        GAMER = 'GAMER', 'Gamer'
        ADMIN = 'ADMIN', 'Admin'

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.GAMER)
    avatar_url = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    # We replace the default username login with email if desired, 
    # but for now we keep username required as per AbstractUser default.
    REQUIRED_FIELDS = ['email', 'role']

    def __str__(self):
        return self.username

# --- 2. Game Model (Page 12) ---
class Game(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    developer = models.CharField(max_length=255, blank=True)
    publisher = models.CharField(max_length=255, blank=True)
    release_date = models.DateField(null=True, blank=True)
    cover_image_url = models.TextField(blank=True, null=True)
    # Average rating is updated automatically when reviews are added
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)

    def __str__(self):
        return self.title

# --- 3. Library Entry (Page 12) ---
# The Join Table for Many-to-Many between User and Game
class LibraryEntry(models.Model):
    class Status(models.TextChoices):
        PLAYING = 'PLAYING', 'Playing'
        COMPLETED = 'COMPLETED', 'Completed'
        DROPPED = 'DROPPED', 'Dropped'
        WISHLIST = 'WISHLIST', 'Wishlist'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='library')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='library_entries')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLAYING)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Page 13: Unique Key to ensure a user cannot add the same game twice
        constraints = [
            models.UniqueConstraint(fields=['user', 'game'], name='unique_library_entry')
        ]
        verbose_name_plural = "Library Entries"

# --- 4. Reviews (Page 13) ---
class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='reviews')
    # Page 16: Strict validation 1-10
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)] 
    )
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Page 13: Prevent review bombing (one review per game per user)
        constraints = [
            models.UniqueConstraint(fields=['user', 'game'], name='unique_user_game_review')
        ]

# --- 5. Follows (Page 13) ---
class Follow(models.Model):
    follower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['follower', 'following'], name='unique_follow')
        ]

# --- 6. Forum Threads (Page 13) ---
class ForumThread(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='threads')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='threads')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title