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
    Takes a set of student credentials and returns an access and refresh JSON web
    token pair to prove the authentication of those credentials.
    Returns HTTP 406 when student account is inactive and HTTP 401 when login credentials are invalid.
    """
    permission_classes = [AllowAny]

    serializer_class = AdminAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed:
            raise
        except TokenError:
            raise InvalidToken()

        return Response(serializer.validated_data, status=status.HTTP_200_OK)