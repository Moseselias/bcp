from django.contrib import admin
from .models import Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display    = ('name', 'email', 'status', 'submitted_at')
    list_filter     = ('status', 'submitted_at')
    search_fields   = ('name', 'email', 'body')
    readonly_fields = ('submitted_at', 'soft_deleted_at', 'replied_at')

    # # Optional: make soft-deleted items visibly hidden by default
    # def get_queryset(self, request):
    #     qs = super().get_queryset(request)
    #     return qs.exclude(status='deleted')