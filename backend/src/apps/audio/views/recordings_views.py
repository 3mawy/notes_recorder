from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from src.apps.audio.models.recordings import AudioRecording
from src.apps.audio.serializers.recordings_serializer import AudioRecordingSerializer


class AudioRecordingViewSet(viewsets.ModelViewSet):
    queryset = AudioRecording.objects.all()
    serializer_class = AudioRecordingSerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        note_id = self.request.data.get('note')
        serializer.save(note_id=note_id)
