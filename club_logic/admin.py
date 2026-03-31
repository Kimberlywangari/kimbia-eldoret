from django.contrib import admin
from .models import CollaborationRequest, Feedback
from django.contrib.admin.models import LogEntry

# This makes the proposals look organized in the admin list
class CollaborationAdmin(admin.ModelAdmin):
    list_display = ('organization_name', 'status', 'processed_by', 'industry', 'collaboration_type', 'created_at')
    list_filter = ('industry', 'collaboration_type', 'status')
    # Prevent manual editing of the "Assignee" field
    readonly_fields = ('processed_by',)

    # AUTOMATION: This stamps the current logged-in user on save
    def save_model(self, request, obj, form, change):
        if change: # Only auto-assign if an existing record is being edited
            obj.processed_by = request.user
        super().save_model(request, obj, form, change)

admin.site.register(CollaborationRequest, CollaborationAdmin)




@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    # This shows: Time, User, What they touched, and the Action (Add/Change/Delete)
    list_display = ('action_time', 'user', 'content_type', 'object_repr', 'action_flag')
    list_filter = ('user', 'action_flag', 'content_type')
    search_fields = ('object_repr', 'change_message')

    # Make these logs read-only so they cannot be tampered with
    def has_add_permission(self, request): return False
    def has_change_permission(self, request, obj=None): return False
    def has_delete_permission(self, request, obj=None): return False
@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('message_snippet', 'created_at')
    readonly_fields = ('message', 'created_at') # Prevents accidental editing

    # This helper function shows just the start of long messages in the list view
    def message_snippet(self, obj):
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message
    message_snippet.short_description = 'Feedback Message'

# Ensure you didn't delete the other registration!
# admin.site.register(CollaborationRequest, CollaborationAdmin)