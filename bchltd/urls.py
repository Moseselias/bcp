"""
URL configuration for bchltd project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # ① Superuser’s Django admin (unchanged)
    path("en/bckend/dj/j32d1/admin/", admin.site.urls),

    # ② Public site (home & thank-you)
    path('', include('messages.urls_public', namespace='messaging')),

    # ③ Staff messages (login_required)
    path('en/messages/', include('messages.urls_staff', namespace='messages')),

    # ④ Accounts (signup/login/logout for second-level admins)
    path('accounts/', include('accounts.urls', namespace='accounts')),
]
# if not settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)