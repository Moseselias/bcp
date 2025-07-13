from django.urls import path
from . import views

app_name = 'messages'

urlpatterns = [
    path('', views.message_list, name='message_list'),
    path('<int:pk>/', views.message_detail, name='message_detail'),
    path('<int:pk>/delete/', views.message_delete, name='message_delete'),
    path('<int:pk>/reply/', views.message_reply, name='message_reply'),
]