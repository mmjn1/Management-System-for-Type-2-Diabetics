from rest_framework import generics
from HealthManagementApp.serialisers.serializers import SupportInquirySerializer, DoctorSerializer
from HealthManagementApp.models import SupportInquiry
from HealthManagementApp.models.users import Doctor

"""
SupportInquiryView handles the creation of new SupportInquiry instances.
Defined the queryset as all instances of SupportInquiry.
The serializer_class is set to SupportInquirySerializer, 
which will handle the conversion between Django models and JSON.

"""
class SupportInquiryView(generics.CreateAPIView):
    queryset = SupportInquiry.objects.all()
    serializer_class = SupportInquirySerializer

"""
DoctorView handles the retrieval of all Doctor instances.
Defined the queryset as all instances of Doctor.
The serializer_class is set to DoctorSerializer, which will handle the conversion between Django models and JSON.

"""
class DoctorView(generics.ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

