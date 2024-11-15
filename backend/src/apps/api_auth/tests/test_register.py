from rest_framework import status
from rest_framework.test import APITestCase
from src.apps.api_auth.models import User
from django.urls import reverse


class UserRegistrationSerializerTests(APITestCase):
    def setUp(self) -> None:
        self.url = reverse("user-registration")
        self.valid_payload = {
            "email": "newuser@example.com",
            "password": "password123",
            "first_name": "Test",
            "last_name": "User",
        }
        self.existing_user = User.objects.create_user(
            email="existinguser@example.com",
            password="password123",
            first_name="Existing",
            last_name="User",
        )

    def test_registration_success(self) -> None:
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", response.data)
        self.assertEqual(response.data["detail"], "User created successfully.")

    def test_registration_duplicate_email(self) -> None:
        payload = {
            "email": self.existing_user.email,
            "password": "password123",
            "first_name": "Test",
            "last_name": "User",
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertEqual(response.data["email"], ["This email is already in use."])

    def test_registration_missing_fields(self) -> None:
        payload = {
            "first_name": "Test",
            "last_name": "User",
            # Missing email and password
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertIn("password", response.data)

    def test_registration_invalid_email(self) -> None:
        payload = {
            "email": "invalid-email",
            "password": "password123",
            "first_name": "Test",
            "last_name": "User",
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertEqual(response.data["email"], ["Enter a valid email address."])

    def test_registration_password_write_only(self) -> None:
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email=self.valid_payload["email"])
        self.assertTrue(user.check_password(self.valid_payload["password"]))
