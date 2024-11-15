from rest_framework import serializers

from src.apps.audio.models.recordings import AudioRecording


class AudioRecordingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioRecording
        fields = '__all__'
