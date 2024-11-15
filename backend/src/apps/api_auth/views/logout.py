from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        response = Response(
            {"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT
        )

        auth_cookie_key = str(settings.SIMPLE_JWT["AUTH_COOKIE"])
        refresh_cookie_key = str(settings.SIMPLE_JWT["REFRESH_COOKIE"])
        cookie_path = str(settings.SIMPLE_JWT["AUTH_COOKIE_PATH"])

        response.delete_cookie(key=auth_cookie_key, path=cookie_path)
        response.delete_cookie(key=refresh_cookie_key, path=cookie_path)

        return response
