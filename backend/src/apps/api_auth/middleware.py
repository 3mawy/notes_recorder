from typing import Any

from django.contrib.auth import get_user_model
from django.http import HttpResponse
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings
from rest_framework import status

from src.apps.api_auth.utils import (
    set_access_cookie,
    set_refresh_cookie,
    get_tokens_for_user,
    get_user,
)


class JWTRefreshMiddleware:

    def __init__(self, get_response: Any) -> None:
        self.get_response = get_response

    def __call__(self, request: Any) -> HttpResponse:
        response = self.get_response(request)
        access_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"])

        try:
            AccessToken(access_token)
        except TokenError:
            refresh_token = request.COOKIES.get(settings.SIMPLE_JWT["REFRESH_COOKIE"])
            # If access token is invalid, check for refresh token
            if refresh_token:
                try:
                    validated_refresh_token = RefreshToken(refresh_token)
                    user = get_user(validated_refresh_token)

                    new_tokens = get_tokens_for_user(user)
                    set_access_cookie(response, new_tokens["access"])
                    set_refresh_cookie(response, new_tokens["refresh"])

                    return response
                except TokenError:
                    error_message = (
                        '{"detail": "Invalid refresh token. Please re-authenticate."}'
                    )
            else:
                error_message = (
                    '{"detail": "No valid refresh token. Please re-authenticate."}'
                )

            response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"])
            response.delete_cookie(settings.SIMPLE_JWT["REFRESH_COOKIE"])
            response.content = error_message
            response.status_code = status.HTTP_401_UNAUTHORIZED
            response["Content-Type"] = "application/json"

            return response

        return response


User = get_user_model()


class DevUserMiddleware:
    """Forces a dev user. Use this middleware in DEV ONLY"""

    def __init__(self, get_response: Any) -> None:
        self.get_response = get_response

    def __call__(self, request: Any) -> HttpResponse:
        try:
            request.user = User.objects.get(email="devuser@example.com")
        except User.DoesNotExist:
            request.user = User.objects.create_superuser(
                email="devuser@example.com",
                password="test12345",
            )

        request._force_auth_user = request.user  # DRF respects this for the user

        return self.get_response(request)
