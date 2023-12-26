from .custom_token_utils import (
    # from .custom_token_utils import CustomTokenObtainPairSerializer
    CustomTokenObtainPairSerializer,
    InActiveUser,  # from .custom_token_utils import InActiveUser
)


from .patient_auth_token import (
    # from .student_auth_token import StudentAuthTokenSerializer
    PatientAuthTokenSerializer,
)

# from .student_auth_token import (
#     # from .student_auth_token import StudentAuthTokenSerializer
#     StudentAuthTokenSerializer,
# )
# from .tutor_auth_token import (
#     TutorAuthTokenSerializer,  # from .student_auth_token import StudentAuthTokenSerializer
# )

from .admin_auth_token import (
    AdminAuthTokenSerializer,  # from .student_auth_token import StudentAuthTokenSerializer
)