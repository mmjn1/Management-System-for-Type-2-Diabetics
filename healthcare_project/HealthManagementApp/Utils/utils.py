from django.contrib.auth.tokens import PasswordResetTokenGenerator
from six import text_type

class AppTokenGenerator(PasswordResetTokenGenerator):
    """
    Custom token generator for account activation.

    This class extends Django's PasswordResetTokenGenerator to create a secure
    token for account activation. It generates a hash value that incorporates
    the user's active status, primary key, and a timestamp. This ensures that
    the token is unique to each user and can be invalidated if necessary
    conditions change (e.g., the user's active status).

    The token is used in account activation workflows, where a user
    must verify their email address to activate their account. Using 
    the timestamp allows for the token to expire, enhancing security by limiting
    the token's valid duration.
    """
    def _make_hash_value(self, user, timestamp):
        return text_type(user.is_active) + text_type(user.pk) + text_type(timestamp)


account_activation_token = AppTokenGenerator()