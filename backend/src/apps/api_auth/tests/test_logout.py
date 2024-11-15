from django.conf import settings
from django.urls import reverse
from dotenv import load_dotenv
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.test import tag

User = get_user_model()
load_dotenv()


@tag("auth", "integration")
class LogoutViewTests(APITestCase):
    def setUp(self) -> None:
        self.logout_url: str = reverse(
            "logout"
        )  # Update this with your actual logout URL name
        self.user = User.objects.create_user(
            email="test@example.com", password="password123"
        )

        # Log in the user and set valid access and refresh tokens as cookies
        refresh = RefreshToken.for_user(self.user)
        self.client.cookies[str(settings.SIMPLE_JWT["AUTH_COOKIE"])] = str(
            refresh.access_token  # type: ignore
        )
        self.client.cookies[str(settings.SIMPLE_JWT["REFRESH_COOKIE"])] = str(refresh)

    def test_logout_authenticated_user(self) -> None:
        response: Response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)
        self.assertEqual(response.data["detail"], "Successfully logged out.")

        # Confirm cookies are either empty or not present
        self.assertTrue(
            not self.client.cookies.get(str(settings.SIMPLE_JWT["AUTH_COOKIE"]), None)
            or self.client.cookies[str(settings.SIMPLE_JWT["AUTH_COOKIE"])].value == ""
        )
        self.assertTrue(
            not self.client.cookies.get(
                str(settings.SIMPLE_JWT["REFRESH_COOKIE"]), None
            )
            or self.client.cookies[str(settings.SIMPLE_JWT["REFRESH_COOKIE"])].value
            == ""
        )

    def test_logout_unauthenticated_user(self) -> None:
        # Clear the cookies to simulate an unauthenticated user
        self.client.cookies.clear()
        response: Response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Ensure cookies are still absent
        self.assertNotIn(str(settings.SIMPLE_JWT["AUTH_COOKIE"]), self.client.cookies)
        self.assertNotIn(
            str(settings.SIMPLE_JWT["REFRESH_COOKIE"]), self.client.cookies
        )

    def test_logout_with_invalid_cookie(self) -> None:
        # Simulate an invalid cookie
        self.client.cookies[str(settings.SIMPLE_JWT["AUTH_COOKIE"])] = (
            "invalid_access_token"
        )
        self.client.cookies[str(settings.SIMPLE_JWT["REFRESH_COOKIE"])] = (
            "invalid_refresh_token"
        )

        response: Response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Confirm cookies are either empty or not present
        self.assertTrue(
            not self.client.cookies.get(str(settings.SIMPLE_JWT["AUTH_COOKIE"]), None)
            or self.client.cookies[str(settings.SIMPLE_JWT["AUTH_COOKIE"])].value == ""
        )
        self.assertTrue(
            not self.client.cookies.get(
                str(settings.SIMPLE_JWT["REFRESH_COOKIE"]), None
            )
            or self.client.cookies[str(settings.SIMPLE_JWT["REFRESH_COOKIE"])].value
            == ""
        )
