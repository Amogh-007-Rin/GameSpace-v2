from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Game, LibraryEntry, Review, Follow, ForumThread

# Register your models here so they show up in the Admin Interface
admin.site.register(User, UserAdmin)
admin.site.register(Game)
admin.site.register(LibraryEntry)
admin.site.register(Review)
admin.site.register(Follow)
admin.site.register(ForumThread)
