from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver

from src.apps.notes.models.notes import Note
from src.core.models import BaseSqlModel


class AudioRecording(BaseSqlModel):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='audio_recordings')
    audio_file = models.FileField(upload_to='audio_recordings/')

    def __str__(self):
        return f"Audio for {self.note.title}"

@receiver(post_delete, sender=AudioRecording)
def delete_audio_file(sender, instance, **kwargs):
    if instance.audio_file:
        instance.audio_file.delete(save=False)