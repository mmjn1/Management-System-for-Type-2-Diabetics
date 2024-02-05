from rest_framework import generics
from HealthManagementApp.serialisers.serializers import SupportInquirySerializer
from HealthManagementApp.models import SupportInquiry

class SupportInquiryView(generics.CreateAPIView):
    queryset = SupportInquiry.objects.all()
    serializer_class = SupportInquirySerializer
