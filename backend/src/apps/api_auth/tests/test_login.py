from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.response import Response
from django.test import tag

User = get_user_model()


@tag("auth", "integration")
class LoginViewTests(APITestCase):
    def setUp(self) -> None:
        self.login_url: str = reverse("login")
        self.user = User.objects.create_user(
            email="test@example.com", password="password123"
        )

    def test_login_valid_credentials_with_2fa(self) -> None:
        User.objects.create_user(
            email="2fa@example.com", password="password123", is_2fa_enabled=True
        )
        response: Response = self.client.post(
            self.login_url, {"email": "2fa@example.com", "password": "password123"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("status", response.data)
        self.assertEqual(response.data["status"], "2FA_REQUIRED")

    def test_login_invalid_credentials(self) -> None:
        response: Response = self.client.post(
            self.login_url, {"email": "wrong@example.com", "password": "wrongpass"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["detail"], "invalid email or password")

    def test_login_inactive_user(self) -> None:
        User.objects.create_user(
            email="inactive@example.com", password="password123", is_active=False
        )
        response: Response = self.client.post(
            self.login_url, {"email": "inactive@example.com", "password": "password123"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["detail"], "invalid email or password")

    def test_login_missing_password(self) -> None:
        response: Response = self.client.post(
            self.login_url, {"email": "test@example.com"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_login_missing_email(self) -> None:
        response: Response = self.client.post(
            self.login_url, {"password": "password123"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)


@tag("auth", "integration")
class UserProfileViewTests(APITestCase):
    def setUp(self) -> None:
        self.profile_url: str = reverse("user-profile")
        self.user = User.objects.create_user(
            email="devuser@example.com", password="password123"
        )

    def test_user_profile_authenticated(self) -> None:
        self.client.force_authenticate(user=self.user)
        response: Response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("email", response.data)
        self.assertEqual(response.data["email"], self.user.email)

    def test_user_profile_unauthenticated(self) -> None:
        response: Response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
