from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

from src.apps.api_auth.models import User
from src.apps.audio.models.recordings import AudioRecording
from src.apps.notes.models.notes import Note

import tempfile
from django.test import tag

@tag("notes", "integration")
class NoteViewSetTestCase(TestCase):
    def setUp(self):
        # Set up a test user with email and password
        self.user = User.objects.create_user(email='testuser@example.com', password='password')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create a test note for the user
        self.note = Note.objects.create(
            user=self.user,
            title='Test Note',
            description='Sample description with [AUDIO_1] as test'
        )

    def create_temp_audio_file(self, file_name='test_audio.wav'):
        """Utility function to create a temporary audio file for testing."""
        temp_audio_file = tempfile.NamedTemporaryFile(suffix='.wav')
        temp_audio_file.write(b'Test audio content')
        temp_audio_file.seek(0)
        return SimpleUploadedFile(
            name=file_name,
            content=temp_audio_file.read(),
            content_type='audio/wav'
        )

    def test_update_note_with_multiple_audio_files(self):
        # Create temporary audio files for testing
        audio_file_1 = self.create_temp_audio_file(file_name='test_audio_1.wav')
        audio_file_2 = self.create_temp_audio_file(file_name='test_audio_2.wav')

        # Prepare the request data
        data = {
            'title': 'Updated Note Title',
            'description': 'Updated description with <audiorecorder id="[PLACEHOLDER1]"></audiorecorder> and <audiorecorder id="[PLACEHOLDER2]"></audiorecorder>',
            'audio_recordings[0][file]': audio_file_1,
            'audio_recordings[0][name]': '[PLACEHOLDER1]',
            'audio_recordings[1][file]': audio_file_2,
            'audio_recordings[1][name]': '[PLACEHOLDER2]',
        }

        # Send the update request
        response = self.client.patch(f'/api/notes/{self.note.id}/', data, format='multipart')

        # Verify the response status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that the note was updated
        self.note.refresh_from_db()
        self.assertEqual(self.note.title, 'Updated Note Title')
        self.assertIn('<audio src=', self.note.description)
        self.assertNotIn('<audiorecorder', self.note.description)

        # Verify that audio recordings were created
        audio_recordings = AudioRecording.objects.filter(note=self.note)
        self.assertEqual(audio_recordings.count(), 2)
        self.assertTrue(audio_recordings.filter(audio_file__contains='test_audio_1.wav').exists())
        self.assertTrue(audio_recordings.filter(audio_file__contains='test_audio_2.wav').exists())

    def test_delete_audio_recording(self):
        # Create an audio recording for the note
        audio_file = self.create_temp_audio_file()
        audio_recording = AudioRecording.objects.create(
            note=self.note,
            audio_file=audio_file
        )

        # Send a PUT request with deleted audio IDs
        data = {
            'description': 'Content without the audio',
            'deleted_audio_ids': [audio_recording.id]
        }

        response = self.client.put(f'/api/notes/{self.note.id}/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the audio recording was deleted
        self.assertEqual(AudioRecording.objects.count(), 0)

    def test_update_note_content_without_audio(self):
        # Update the note description without adding or deleting audio
        data = {
            'description': 'Completely new description without audio',
        }

        response = self.client.put(f'/api/notes/{self.note.id}/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the description was updated correctly
        updated_note = Note.objects.get(id=self.note.id)
        self.assertEqual(updated_note.description, 'Completely new description without audio')

