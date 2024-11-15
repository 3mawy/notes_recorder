from django.db import models

from src.apps.api_auth.models import User


class Email2FA(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code_hash = models.CharField(max_length=255)
    expiry_date = models.DateTimeField()

    def __str__(self) -> str:
        return f"2FA for {self.user.email}"
