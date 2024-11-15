from typing import Any

from rest_framework import serializers

from src.apps.api_auth.validators import validate_password_strength, validate_user_email


class PasswordRecoveryRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[validate_user_email])


class PasswordRecoveryConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True, validators=[validate_password_strength]
    )
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data: dict[str, Any]) -> dict[str, Any]:
        if data["new_password"] != data["password_confirmation"]:
            raise serializers.ValidationError({"new_password": "Passwords must match."})
        return data
