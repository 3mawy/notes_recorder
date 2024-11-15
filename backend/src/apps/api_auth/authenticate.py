from __future__ import annotations
from django.conf import settings
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication, AuthUser
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.authtoken.models import Token

from src.apps.api_auth.utils import get_user


class CustomAuthentication(JWTAuthentication):
    """Custom authentication class for JWT in HTTP-only cookie."""

    def authenticate(self, request: Request) -> None | tuple[AuthUser, Token]:  # type: ignore
        # Get the access token from cookies
        raw_access_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"])  # type: ignore

        if raw_access_token is None:
            return None

        try:
            validated_token = AccessToken(raw_access_token)
            user = get_user(validated_token)
            return user, validated_token  # type: ignore

        except TokenError:
            # Access token is invalid or expired
            refresh_token = request.COOKIES.get(settings.SIMPLE_JWT["REFRESH_COOKIE"])  # type: ignore

            if refresh_token:
                try:
                    validated_refresh_token = RefreshToken(refresh_token)
                    user = get_user(validated_refresh_token)
                    return user, validated_refresh_token  # type: ignore

                except TokenError:
                    return None

            return None
