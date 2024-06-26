from django.contrib import admin
from .models import Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'recipient', 'timestamp']
    list_filter = ['sender', 'recipient']
    search_fields = ['sender__username', 'recipient__username', 'message']