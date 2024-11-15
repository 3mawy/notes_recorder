from django.db import models
from src.apps.api_auth.models import User

from src.core.models import BaseSqlModel


class Note(BaseSqlModel):
    NOTE_TYPE_CHOICES = [
        ('text', 'Text Note'),
        ('memo', 'Memo')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()  # Text "description" of the note
    type = models.CharField(max_length=10, choices=NOTE_TYPE_CHOICES, default='text')


    def __str__(self) -> str:
        return f"{self.user}, {self.title}"
    class Meta:
        ordering = ["-updated_at"]