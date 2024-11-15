from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from src.apps.api_auth.models import User, Email2FA
from django.utils import timezone
import hashlib
from rest_framework.response import Response
from datetime import timedelta
from django.test import tag


@tag("auth", "integration")
class Verify2FAViewTests(APITestCase):
    def setUp(self) -> None:
        self.url: str = reverse("2fa")

        self.user: User = User.objects.create_user(
            email="testuser@example.com",
            password="password123",
            first_name="Test",
            last_name="User",
        )

        # Create a valid 2FA code entry for the test user
        self.code: str = "123456"
        self.code_hash: str = hashlib.sha256(str(self.code).encode()).hexdigest()
        self.two_fa_record: Email2FA = Email2FA.objects.create(
            user=self.user,
            code_hash=self.code_hash,
            expiry_date=timezone.now() + timedelta(minutes=5),
        )

    def test_verify_2fa_success(self) -> None:
        response: Response = self.client.post(
            self.url, {"email": self.user.email, "code": self.code}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["email"], self.user.email)

    def test_verify_2fa_invalid_code(self) -> None:
        response: Response = self.client.post(
            self.url, {"email": self.user.email, "code": "wrongcode"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Invalid or expired 2FA code.")

    def test_verify_2fa_expired_code(self) -> None:
        # Create an expired 2FA code entry
        expired_code_hash: str = hashlib.sha256(str("654321").encode()).hexdigest()
        Email2FA.objects.create(
            user=self.user,
            code_hash=expired_code_hash,
            expiry_date=timezone.now() - timedelta(minutes=1),  # Expired
        )

        response: Response = self.client.post(
            self.url, {"email": self.user.email, "code": "654321"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Invalid or expired 2FA code.")

    def test_verify_2fa_user_not_found(self) -> None:
        response: Response = self.client.post(
            self.url,
            {"email": "nonexistent@example.com", "code": self.code},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["detail"], "User not found.")
