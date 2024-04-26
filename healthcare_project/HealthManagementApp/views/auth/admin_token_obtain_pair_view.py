from .common_imports import (
    TokenViewBase,  # from rest_framework_simplejwt.views import TokenViewBase
    AllowAny,  # from rest_framework.permissions import AllowAny
    Response,  # from rest_framework.response import Response
    # from rest_framework_simplejwt.exceptions import AuthenticationFailed
    AuthenticationFailed,
    InvalidToken,  # from rest_framework_simplejwt.exceptions import InvalidToken
    TokenError,  # from rest_framework_simplejwt.exceptions import TokenError
    status,  # from rest_framework import status
)


from HealthManagementApp.serialisers.auth import (
    AdminAuthTokenSerializer,  # from .serializers.auth import AdminAuthTokenSerializer

)


class AdminTokenObtainPairView(TokenViewBase):
    """
    A view that handles the authentication of administrative users and returns JWT access and refresh tokens.
    This view uses the AdminAuthTokenSerializer to validate the credentials provided in the request.
    It allows any user to attempt authentication but will only succeed if the credentials match an administrative user.

    Responses:
    - HTTP 200 OK: If the credentials are valid and the user is an admin, returns the token pair.
    - HTTP 401 Unauthorized: If the login credentials are invalid.
    - HTTP 406 Not Acceptable: If the account is inactive (handled by the serializer).
    """
    permission_classes = [AllowAny]
    serializer_class = AdminAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests to authenticate an admin user and issue JWT tokens.

        Args:
            request: The HTTP request object containing the authentication credentials.

        Returns:
            Response: A DRF Response object containing the JWT token pair or an error message.
        """
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed:
            raise
        except TokenError:
            raise InvalidToken()

        return Response(serializer.validated_data, status=status.HTTP_200_OK)