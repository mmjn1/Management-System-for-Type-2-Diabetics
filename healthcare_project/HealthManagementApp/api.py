from rest_framework import generics, permissions
from rest_framework.response import Response

from HealthManagementApp.models import Doctor, Patient
from HealthManagementApp.serialisers import UserSerializersData
from HealthManagementApp.serialisers.Doctor import DoctorSerializerDetail
from HealthManagementApp.serialisers.Patient import PatientSerializerDetails


class UserDetails(generics.GenericAPIView):
    def get(self, request):
        user = self.request.user
        user_data = UserSerializersData(user, context=self.get_serializer_context()).data

        if user.type == 'Doctor':
            doctor = Doctor.objects.get(user=user)
            information = DoctorSerializerDetail(doctor, context=self.get_serializer_context()).data
        elif user.type == 'Patient':
            patient = Patient.objects.get(user=user)
            information = PatientSerializerDetails(patient, context=self.get_serializer_context()).data
        else:
            information = {}
        return Response({"user": user_data,
                         "information": information
                         })