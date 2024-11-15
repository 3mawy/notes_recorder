from typing import Any

from django.conf import settings
from rest_framework.request import Request
from hashlib import sha256
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import AllowAny

from src.apps.api_auth.utils import generate_token_with_expiry, send_email
from src.apps.api_auth.models import User, PasswordRecovery
from src.apps.api_auth.serializers import (
    PasswordRecoveryConfirmSerializer,
    PasswordRecoveryRequestSerializer,
)


class PasswordRecoveryRequestView(APIView):
    permission_classes = [AllowAny]  # type: ignore
    authentication_classes = []

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = PasswordRecoveryRequestSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError:
            return Response(
                {"detail": "User with this email does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        email = serializer.validated_data["email"]

        user = User.objects.get(email=email)

        raw_token, token_hash, expiry_date = generate_token_with_expiry(expiry_hours=1)

        PasswordRecovery.objects.create(
            user=user, token_hash=token_hash, expiry_date=expiry_date
        )
        reset_url = f"{settings.FRONTEND_URL}/auth/reset-password?token={raw_token}"

        send_email(
            subject="Password Recovery Request",
            recipient_list=[user.email],
            template_name="password_recovery_email.html",
            context={"reset_url": reset_url, "user": user},
            from_email="no-reply@notes.3mawy.com.com",
        )

        return Response(
            {"detail": "Password recovery link has been sent to your email."},
            status=status.HTTP_200_OK,
        )


class PasswordRecoveryConfirmView(APIView):
    permission_classes = [AllowAny]  # type: ignore
    authentication_classes = []

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = PasswordRecoveryConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        raw_token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        token_hash = sha256(raw_token.encode()).hexdigest()

        try:
            recovery = PasswordRecovery.objects.get(token_hash=token_hash)

            if not recovery.is_valid():
                return Response(
                    {"detail": "Token has expired."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = recovery.user
            user.set_password(new_password)
            user.save()

            # Optionally, delete the recovery entry after successful password reset
            recovery.delete()

            return Response(
                {"detail": "Password has been reset successfully."},
                status=status.HTTP_200_OK,
            )

        except PasswordRecovery.DoesNotExist:
            return Response(
                {"detail": "Invalid token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
