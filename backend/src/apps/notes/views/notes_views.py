from typing import Any

from rest_framework import viewsets, status
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from src.apps.audio.models.recordings import AudioRecording
from src.apps.notes.models.notes import Note
from src.apps.notes.serializers.note_serializer import NoteSerializer
from src.core.permissions import IsOwner


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = [IsAuthenticated, IsOwner]
    filter_backends = [ SearchFilter]
    search_fields = ["title"]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user).select_related('user').prefetch_related('audio_recordings')

    def perform_create(self, serializer):
        note = serializer.save(user=self.request.user, title="New Note")
        return Response(self.get_serializer(note).data, status=status.HTTP_200_OK)

    def update(self, request, *args: Any, **kwargs: Any) -> Response:
        note: Note = self.get_object()
        data = request.data
        description: str = data.get('description', note.description)
        title: str = data.get('title', note.title)

        # Handle deleted audio recordings
        deleted_audio_ids = data.getlist('deleted_audio_ids', [])
        if deleted_audio_ids:
            recordings_to_delete = AudioRecording.objects.filter(
                id__in=deleted_audio_ids,
                note=note
            )
            for recording in recordings_to_delete:
                if recording.audio_file:
                    recording.audio_file.delete(save=False)
            recordings_to_delete.delete()

        index = 0
        while f'audio_recordings[{index}][file]' in request.FILES:
            file_key = f'audio_recordings[{index}][file]'
            name_key = f'audio_recordings[{index}][name]'
            audio_file = request.FILES[file_key]
            placeholder_tag = data.get(name_key)

            if audio_file and placeholder_tag:
                new_recording = AudioRecording.objects.create(
                    note=note,
                    audio_file=audio_file
                )

                # Replace the placeholder in the description
                audio_tag = f'<audiorecorder id="{placeholder_tag}"></audiorecorder>'
                actual_audio_html = f'<audio src="{new_recording.audio_file.url}" ></audio>'
                description = description.replace(audio_tag, actual_audio_html)

            index += 1

        note.description = description
        note.title = title
        note.save()

        note.refresh_from_db()
        serializer = self.get_serializer(note)
        return Response(serializer.data, status=status.HTTP_200_OK)
