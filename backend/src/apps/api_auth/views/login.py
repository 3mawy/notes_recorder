from typing import Any
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from rest_framework.views import APIView
from django.http import Http404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from src.apps.api_auth.serializers import LoginSerializer, UserSerializer
from src.apps.api_auth.utils import generate_2fa_code, set_access_cookie, set_refresh_cookie, generate_jwt_response
from src.apps.api_auth.models import User


class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self) -> User:
        user = self.request.user
        if isinstance(user, AnonymousUser):
            raise Http404("User not found")
        return user

    # def get(self, request, *args, **kwargs):
    #     return Response(
    #         {"detail": "error test"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
    #     )
    #
    #


class LoginView(APIView):
    permission_classes = [AllowAny]  # type: ignore
    authentication_classes = []

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        try:
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed:
            return Response(
                {"detail": "invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = serializer.validated_data.get("user")

        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_2fa_enabled:
            return generate_jwt_response(user)

        # Trigger 2FA code generation for users with 2FA enabled
        generate_2fa_code(user)
        return Response(
            {
                "detail": "2FA code has been sent to your email.",
                "status": "2FA_REQUIRED",
            },
            status=status.HTTP_200_OK,
        )


def health_check(request: Request) -> JsonResponse:
    return JsonResponse({"status": "healthy"})
