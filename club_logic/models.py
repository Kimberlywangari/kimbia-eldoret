from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class CollaborationRequest(models.Model):
    # Field options for dropdowns
    INDUSTRY_CHOICES = [
        ('health', 'Health & Wellness'),
        ('sports', 'Sports Apparel & Gear'),
        ('nutrition', 'Nutrition & Supplements'),
        ('local', 'Local Eldoret Business'),
        ('tech', 'Tech & Fitness Apps'),
        ('media', 'Media & Content Creation'),
        ('other', 'Other'),
    ]
    
    COLAB_TYPE_CHOICES = [
        ('sponsor', 'Event Sponsorship'),
        ('partner', 'Community Partnership'),
        ('brand', 'Brand Ambassadorship'),
        ('gear', 'Gear/Product Testing'),
        ('media', 'Media Coverage'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('contacted', 'Contacted/Replied'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    ]
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending'
    )
    
    # ForeignKey connects the request to a specific Superuser
    processed_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    
    internal_notes = models.TextField(
        blank=True, 
        help_text="Private notes for the team"
    )

    organization_name = models.CharField(max_length=200)
    website_link = models.URLField(max_length=500, blank=True)
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES)
    collaboration_type = models.CharField(max_length=50, choices=COLAB_TYPE_CHOICES)
    org_email = models.EmailField()
    proposal = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.organization_name
class Feedback(models.Model):
    # The actual feedback text
    message = models.TextField()
    
    # Automatically records the date and time when submitted
    created_at = models.DateTimeField(auto_now_add=True)

    def __cl_str__(self):
        # This makes it look nice in the admin list
        return f"Feedback from {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        verbose_name_plural = "Feedback" # Fixes the "Feedbacks" typo in Admin