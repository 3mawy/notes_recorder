from rest_framework import serializers
import re

from src.apps.api_auth.models import User


def validate_user_email(value: str) -> None:
    """Ensure the user with this email exists."""
    if not User.objects.filter(email=value).exists():
        raise serializers.ValidationError("User with this email does not exist.")


def validate_password_strength(value: str) -> None:
    """Validate password strength."""
    if len(value) < 8:
        raise serializers.ValidationError(
            "Password must be at least 8 characters long."
        )
    if not re.search(r"[A-Z]", value):
        raise serializers.ValidationError(
            "Password must contain at least one uppercase letter."
        )
    if not re.search(r"[a-z]", value):
        raise serializers.ValidationError(
            "Password must contain at least one lowercase letter."
        )
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
        raise serializers.ValidationError(
            "Password must contain at least one special character."
        )
