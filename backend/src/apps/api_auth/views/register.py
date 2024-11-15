from typing import cast, Optional

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.serializers import BaseSerializer

from src.apps.api_auth.models import User
from src.apps.api_auth.serializers import UserRegistrationSerializer


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def perform_create(self, serializer: BaseSerializer) -> None:
        user = serializer.save()
        user.set_password(serializer.validated_data['password'])
        user.save()

    def create(self, request: Request, *args: str, **kwargs: dict) -> Response:
        serializer = cast(
            UserRegistrationSerializer, self.get_serializer(data=request.data)
        )
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        user = cast(Optional[User], serializer.instance)

        return Response(
            {
                "id": user.id,
                "detail": "User created successfully.",
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )
