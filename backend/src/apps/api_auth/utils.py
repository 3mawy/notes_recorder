from __future__ import annotations

import hashlib
import secrets
import random
from datetime import datetime, timedelta
from hashlib import sha256
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework_simplejwt import exceptions
from rest_framework_simplejwt.tokens import RefreshToken, Token

from src.apps.api_auth.models import Email2FA, User

from django.conf import settings
from django.utils import timezone
from rest_framework.response import Response


from typing import Any, Dict
from rest_framework import status



def generate_token_with_expiry(
    expiry_minutes: int = 0, expiry_hours: int = 0, expiry_days: int = 0
) -> tuple[str, str, datetime]:
    raw_token = secrets.token_urlsafe(16)
    token_hash = sha256(raw_token.encode()).hexdigest()
    expiry_date = timezone.now() + timedelta(
        minutes=expiry_minutes, hours=expiry_hours, days=expiry_days
    )
    return raw_token, token_hash, expiry_date


def generate_2fa_code(user: User) -> str:
    code = str(random.randint(100000, 999999))
    code_hash = hashlib.sha256(code.encode()).hexdigest()
    expiry_date = timezone.now() + timedelta(minutes=5)

    Email2FA.objects.update_or_create(
        user=user, defaults={"code_hash": code_hash, "expiry_date": expiry_date}
    )

    send_email(
        subject="Your 2FA Code",
        recipient_list=[user.email],
        template_name="2fa_email.html",
        context={
            "user": user,
            "code": code,
        },
    )
    return code


def send_email(
    subject: str,
    recipient_list: list[str],
    template_name: str,
    context: dict,
    from_email: str | None = None,
) -> None:
    email_body = render_to_string(template_name, context)
    from_email = from_email or settings.DEFAULT_FROM_EMAIL

    send_mail(
        subject,
        email_body,
        from_email,
        recipient_list,
        fail_silently=False,
        html_message=email_body,
    )


def set_access_cookie(response: Response, access_token: str) -> None:
    # expires = (
    #     timezone.now() + settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]  # type:ignore
    # )
    # max_age = int((expires - timezone.now()).total_seconds())

    response.set_cookie(
        key=str(settings.SIMPLE_JWT["AUTH_COOKIE"]),
        value=access_token,
        domain=str(settings.SIMPLE_JWT["AUTH_COOKIE_DOMAIN"]),
        path=str(settings.SIMPLE_JWT["AUTH_COOKIE_PATH"]),
        max_age=5000,
        secure=bool(settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"]),
        httponly=bool(settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"]),
        samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],  # type: ignore
    )


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    # expires = (
    #     timezone.now() + settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]  # type:ignore
    # )
    # max_age = int((expires - timezone.now()).total_seconds())

    response.set_cookie(
        key=str(settings.SIMPLE_JWT["REFRESH_COOKIE"]),
        value=refresh_token,
        domain=str(settings.SIMPLE_JWT["AUTH_COOKIE_DOMAIN"]),
        path=str(settings.SIMPLE_JWT["AUTH_COOKIE_PATH"]),
        max_age=5000,
        secure=bool(settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"]),
        httponly=bool(settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"]),
        samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],  # type: ignore
    )


def get_tokens_for_user(user: User) -> dict[str, str]:
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),  # type: ignore
    }


def get_user(validated_token: Token) -> User:
    user_id = validated_token.get("user_id")

    if user_id is None:
        raise exceptions.AuthenticationFailed("User ID not found in the token.")

    try:
        user = User.objects.get(id=user_id)
        return user
    except User.DoesNotExist:
        raise exceptions.AuthenticationFailed("User not found.")


def generate_jwt_response(user: User) -> Response:
    """
    Generate a JWT response for a given user, including setting access and refresh cookies.

    Args:
        user (User): The user for whom the JWT tokens are generated.

    Returns:
        Response: A DRF Response object containing user data and JWT cookies.
    """
    refresh = RefreshToken.for_user(user)
    access_token: str = str(refresh.access_token)  # type: ignore

    user_data: Dict[str, Any] = {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }

    response: Response = Response(
        {
            "user": user_data,
        },
        status=status.HTTP_200_OK,
    )

    set_access_cookie(response, access_token)
    set_refresh_cookie(response, str(refresh))

    return response
