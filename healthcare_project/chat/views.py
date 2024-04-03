from django.http import JsonResponse
from .models import Message
from django.views.decorators.http import require_http_methods
from django.core.serializers import serialize
import json
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage


@require_http_methods(["GET"])
def get_messages(request):
    """
    Retrieves the latest 50 messages from the database i.e. the Message model, 
    ordered by their timestamp in descending order.
    
    Returns:
        JsonResponse containing a list of the latest 50 messages.
    """
    messages = Message.objects.all().order_by('-timestamp')[:50]
    return JsonResponse({'messages': json.loads(serialize('json', messages))})


@require_http_methods(["POST"])
def post_message(request):
    """
    Create a new message record from POST data and save it to the database.
    
    Args:
        request: HttpRequest object containing the message data in JSON format.
        
    Returns:
        JsonResponse indicating the save status and the ID of the created message.
    """
    data = json.loads(request.body)
    message = Message.objects.create(**data)
    return JsonResponse({'status': 'Message saved', 'message': {'id': message.id}})


@csrf_exempt
@require_http_methods(["POST"])
def upload_attachment(request):
    """
    Upload a file attachment associated with a message and stores it in the default storage.
    
    Args:
        request: HttpRequest object containing the file in the FILES dictionary.
        
    Returns:
        JsonResponse with the upload status and URL of the uploaded file if successful,
        or a status indicating failure if no file was uploaded.
    """
    file = request.FILES.get('file')
    if file:
        file_name = default_storage.save(file.name, file)
        file_url = default_storage.url(file_name)
        return JsonResponse({'status': 'File uploaded', 'url': file_url})
    return JsonResponse({'status': 'No file uploaded'}, status=400)


