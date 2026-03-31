from django.shortcuts import render, redirect
from .models import CollaborationRequest
from django.contrib import messages
from .models import Feedback

def index(request):
    # 1. Check if the user is submitting the form (POST)
    if request.method == 'POST':
        # 2. Extract data and save it directly to the database
        CollaborationRequest.objects.create(
            organization_name=request.POST.get('organization_name'),
            website_link=request.POST.get('website_link'),
            industry=request.POST.get('industry'),
            collaboration_type=request.POST.get('collaboration_type'),
            org_email=request.POST.get('org_email'),
            proposal=request.POST.get('proposal')
        )
        # 3. Redirect back to the home page so they don't submit twice if they refresh
        return redirect('index')

    # 4. If they are just visiting the page (GET), show them the site
    return render(request, 'club_logic/index.html')
def leave_feedback(request):
    if request.method == "POST":
        message_content = request.POST.get('message')
        
        if message_content:
            # This creates the record in the database
            Feedback.objects.create(message=message_content)
            messages.success(request, "Thank you for your feedback!")
        else:
            messages.error(request, "Feedback cannot be empty.")
            
    return redirect('index') # Or wherever your form is located