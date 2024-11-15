import hashlib

from src.apps.api_auth.utils import set_access_cookie, set_refresh_cookie, generate_jwt_response
from src.apps.api_auth.models.user import User
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from src.apps.api_auth.models import Email2FA
from rest_framework.request import Request
from rest_framework.permissions import AllowAny


class Verify2FAView(APIView):
    permission_classes = [AllowAny]  # type: ignore
    authentication_classes = []

    def post(self, request: Request, *args: tuple, **kwargs: dict) -> Response:
        email = request.data.get("email")
        code = request.data.get("code")

        try:
            user = User.objects.get(email=email)
            code_hash = hashlib.sha256(str(code).encode()).hexdigest()
            two_fa_record = Email2FA.objects.filter(
                user=user, code_hash=code_hash, expiry_date__gte=timezone.now()
            ).first()

            if not two_fa_record:
                return Response(
                    {"detail": "Invalid or expired 2FA code."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return generate_jwt_response(user)

        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )
