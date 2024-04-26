from .common_imports import (
    get_object_or_404, 
    generics, 
    Response, 
    api_view, 
    UserViewSet, 
    CustomUser, 
    permissions, 
)

from HealthManagementApp.serialisers import (
    PatientRegisterSerialiser, 
)

from .base_user_views import (
    UserRegistrationView, 
)

class PatientCreateView(UserRegistrationView):
    """
    A view for registering new patients. This class extends UserRegistrationView, utilizing the Djoser UserViewSet
    for handling user registration with additional configurations specific to patients.

    Attributes:
        serializer_class (Serializer): Specifies the serializer to use for patient registration. This is set to
                                       PatientRegisterSerialiser which handles the serialization of patient data.
        permission_classes (list): Defines the permission classes that control access to this view. Set to AllowAny
                                   to permit any user to access this view, facilitating the registration of new patients.
    """
    serializer_class = PatientRegisterSerialiser 
    permission_classes = [permissions.AllowAny] 

    def get_serializer_class(self):
        """
        Overrides the get_serializer_class method from UserRegistrationView to specify the serializer class
        for patient registration.

        Returns:
            PatientRegisterSerialiser: The serializer class used for registering new patients.
        """
        return PatientRegisterSerialiser