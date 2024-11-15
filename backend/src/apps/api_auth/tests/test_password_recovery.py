from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from src.apps.api_auth.models import User, PasswordRecovery
from hashlib import sha256
from datetime import datetime, timedelta
from rest_framework.response import Response
from django.test import tag


@tag("auth", "integration")
class PasswordRecoveryTests(APITestCase):
    def setUp(self) -> None:
        self.user: User = User.objects.create_user(
            email="testuser@example.com", password="initialPassword123"
        )
        self.request_url: str = reverse("password_recovery_request")
        self.confirm_url: str = reverse("password_recovery_confirm")

    def test_password_recovery_request_successful(self) -> None:
        response: Response = self.client.post(
            self.request_url, {"email": self.user.email}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("detail", response.data)

    def test_password_recovery_request_invalid_email(self) -> None:
        response: Response = self.client.post(
            self.request_url, {"email": "invalid@example.com"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["detail"], "User with this email does not exist."
        )

    def test_password_recovery_confirm_successful(self) -> None:
        raw_token: str = "sample_valid_token"
        token_hash: str = sha256(raw_token.encode()).hexdigest()
        expiry_date: datetime = timezone.now() + timedelta(hours=1)

        PasswordRecovery.objects.create(
            user=self.user, token_hash=token_hash, expiry_date=expiry_date
        )

        response: Response = self.client.post(
            self.confirm_url,
            {
                "token": raw_token,
                "new_password": "NewPassword@123",
                "password_confirmation": "NewPassword@123",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("detail", response.data)

        # Verify password has changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewPassword@123"))

    def test_password_recovery_confirm_expired_token(self) -> None:
        raw_token: str = "expired_token"
        token_hash: str = sha256(raw_token.encode()).hexdigest()
        expiry_date: datetime = timezone.now() - timedelta(hours=1)

        PasswordRecovery.objects.create(
            user=self.user, token_hash=token_hash, expiry_date=expiry_date
        )

        response: Response = self.client.post(
            self.confirm_url,
            {
                "token": raw_token,
                "new_password": "NewPassword@123",
                "password_confirmation": "NewPassword@123",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Token has expired.")

    def test_password_recovery_confirm_invalid_token(self) -> None:
        response: Response = self.client.post(
            self.confirm_url,
            {
                "token": "invalid_token",
                "new_password": "NewPassword@123",
                "password_confirmation": "NewPassword@123",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Invalid token.")
