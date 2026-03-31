from django.urls import path
from . import views  # Imports the views.py file you just edited

urlpatterns = [
    # When the path is empty (the homepage), trigger the 'index' view
    path('', views.index, name='index'), 
    path('leave-feedback/', views.leave_feedback, name='leave_feedback'),
]