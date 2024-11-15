from django.db import models
from django.utils import timezone

from src.apps.api_auth.models import User


class PasswordRecovery(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token_hash = models.CharField(max_length=255)
    expiry_date = models.DateTimeField()

    def is_valid(self) -> bool:
        return timezone.now() < self.expiry_date

    def __str__(self) -> str:
        return f"Recovery for {self.user.email}"
