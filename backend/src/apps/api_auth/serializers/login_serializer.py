from __future__ import annotations
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from src.apps.api_auth.models import User
from typing import Dict, Any


class LoginSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=True)

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not isinstance(email, str):
            raise serializers.ValidationError("Email is required.")

        if not password or not isinstance(password, str):
            raise serializers.ValidationError("Password is required.")

        user: User | None = User.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed("Invalid email or password.")
        if not user.check_password(password):
            raise AuthenticationFailed("Invalid email or password.")
        if not user.is_active:
            raise AuthenticationFailed("This account is inactive.")

        attrs["user"] = user
        return attrs
