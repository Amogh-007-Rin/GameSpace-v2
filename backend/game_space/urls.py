from django.contrib import admin
from django.urls import path, include # <--- Make sure 'include' is imported

urlpatterns = [
    path('admin/', admin.site.urls),
    # This line is CRITICAL. It tells Django "Send any URL starting with 'api/' to core/urls.py"
    path('api/', include('core.urls')), 
]