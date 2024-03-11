from .account import UserSerializer, PatientSerialiser, PatientRegisterSerialiser

##############
##### Auth Token Serializers #####
##############
from .auth.custom_token_utils import (
    InActiveUser,
    CustomTokenObtainPairSerializer,
)

from .auth.patient_auth_token import (
    PatientAuthTokenSerializer,
)

from .auth.admin_auth_token import (CustomTokenCreateSerializer,
                                    AdminAuthTokenSerializer,   
                                    )
from .serializers import loginSerializer,UserSerializersData
