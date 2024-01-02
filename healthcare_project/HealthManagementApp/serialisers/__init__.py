from .account import UserSerializer, PatientSerialiser, PatientRegisterSerialiser


##############
##### Auth Token Serializers #####
##############
from .auth.custom_token_utils import (
    InActiveUser,
    CustomTokenObtainPairSerializer,
)


from .auth.patient_auth_token import (
    # from .student_auth_token import StudentAuthTokenSerializer
    PatientAuthTokenSerializer,
)


from .auth.admin_auth_token import (
    AdminAuthTokenSerializer,  # from .student_auth_token import StudentAuthTokenSerializer
)