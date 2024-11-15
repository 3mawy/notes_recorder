from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from src.apps.api_auth.views import (
    LoginView,
    UserProfileView,
    UserRegistrationView,
    Verify2FAView,
    LogoutView,
    PasswordRecoveryRequestView,
    PasswordRecoveryConfirmView,
)

urlpatterns = [
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("login/", LoginView.as_view(), name="login"),
    path("2fa/", Verify2FAView.as_view(), name="2fa"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("register/", UserRegistrationView.as_view(), name="user-registration"),
    path(
        "password-recovery/",
        PasswordRecoveryRequestView.as_view(),
        name="password_recovery_request",
    ),
    path(
        "password-recovery/confirm/",
        PasswordRecoveryConfirmView.as_view(),
        name="password_recovery_confirm",
    ),
]
