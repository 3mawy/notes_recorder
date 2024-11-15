from typing import Sequence

from .login import LoginView, UserProfileView
from .logout import LogoutView
from .register import UserRegistrationView
from .two_fa import Verify2FAView
from .password_recovery import PasswordRecoveryRequestView, PasswordRecoveryConfirmView

__all__: Sequence[str] = [
    "LoginView",
    "Verify2FAView",
    "LogoutView",
    "UserProfileView",
    "UserRegistrationView",
    "PasswordRecoveryRequestView",
    "PasswordRecoveryConfirmView",
]
