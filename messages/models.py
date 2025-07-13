from django.db import models
from django.utils import timezone

class Message(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('deleted', 'Deleted'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    body = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='new')
    submitted_at = models.DateTimeField(auto_now_add=True)
    soft_deleted_at = models.DateTimeField(null=True, blank=True)
    reply_body = models.TextField(blank=True)
    replied_at = models.DateTimeField(null=True, blank=True)

    def soft_delete(self):
        self.status = 'deleted'
        self.soft_deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.name} <{self.email}>"