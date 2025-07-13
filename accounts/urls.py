from django.urls import path
from django.contrib.auth.views import LogoutView

from .views import signup, StaffLoginView

from .views import test_404

app_name = 'accounts'

urlpatterns = [
    path('test-404/', test_404),

    path('signup/', signup, name='signup'),
    path('login/',  StaffLoginView.as_view(), name='login'),
    # path('login/',  StaffLoginView.as_view(template_name='accounts/login.html'), name='login'),
    path('logout/', LogoutView.as_view(next_page='accounts:login'), name='logout'),
]