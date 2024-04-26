from .common_imports import (
    get_object_or_404,  
    generics,  
    Response,  
    api_view,  
    UserViewSet,  
    CustomUser,  )
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny


class UserRegistrationView(UserViewSet):
    """
    A view that extends Djoser's UserViewSet to handle user registration. This view is tailored to manage
    the registration of users by utilizing a custom user model and potentially custom serializer classes.

    Attributes:
        queryset (QuerySet): The queryset that points to all instances of CustomUser. This is used by Djoser
                             to perform various user-related operations.
    """
    queryset = CustomUser.objects.all()

    def get_serializer_class(self):
        """
        Specifies the serializer class to be used for user registration. This method can be overridden
        in child classes to provide custom serializer behavior depending on the registration requirements.

        Returns:
            UserSerializer: The serializer class used for registering new users.
        """
        return UserSerializer