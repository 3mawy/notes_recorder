from rest_framework import serializers
from src.apps.audio.serializers.recordings_serializer import AudioRecordingSerializer
from src.apps.notes.models.notes import Note


class NoteSerializer(serializers.ModelSerializer):
    audio_recordings = AudioRecordingSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = '__all__'
        extra_kwargs = {
            'user': {'required': False, 'write_only': True},
        }
